import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import {
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  names,
  readJson,
  writeJson,
  type Tree,
} from '@nx/devkit';
import type { RemoteAppGeneratorSchema } from './schema';

const currentDir = dirname(fileURLToPath(import.meta.url));

const BASE_PORT = 5101;

function titleCase(value: string): string {
  return value
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function nextFreePort(tree: Tree): number {
  let highest = BASE_PORT - 1;
  for (const app of tree.children('apps')) {
    const viteConfigPath = `apps/${app}/vite.config.ts`;
    if (!tree.exists(viteConfigPath)) continue;
    const content = tree.read(viteConfigPath, 'utf-8') ?? '';
    for (const match of content.matchAll(/port:\s*(\d+)/g)) {
      highest = Math.max(highest, Number(match[1]));
    }
  }
  return highest + 1;
}

function replaceOnce(
  tree: Tree,
  filePath: string,
  search: string,
  replace: string,
): void {
  const content = tree.read(filePath, 'utf-8') ?? '';
  // Anchors are authored with bare \n, but files in this repo are checked out with
  // CRLF line endings — normalize both the search and the inserted text to whatever
  // EOL the file actually uses, so multi-line anchors match and we don't leave the
  // file with mixed line endings.
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const normalizedSearch = eol === '\r\n' ? search.replace(/\n/g, '\r\n') : search;
  if (!content.includes(normalizedSearch)) {
    throw new Error(
      `remote-app generator: expected anchor text not found in ${filePath}. ` +
        `The file has likely changed since this generator was written — update the ` +
        `generator's anchor strings in tools/generators/remote-app/generator.ts to match. ` +
        `Anchor: ${JSON.stringify(search)}`,
    );
  }
  const normalizedReplace = eol === '\r\n' ? replace.replace(/\n/g, '\r\n') : replace;
  tree.write(filePath, content.replace(normalizedSearch, normalizedReplace));
}

function wireIntoShellConfig(tree: Tree, name: string, port: number): void {
  const configPath = 'apps/shell/public/config.json';
  const config = readJson<{
    environment: string;
    remotes: Record<string, { name: string; entry: string }>;
  }>(tree, configPath);
  if (config.remotes[name]) {
    throw new Error(
      `remote-app generator: "${name}" is already registered in ${configPath}.`,
    );
  }
  config.remotes[name] = {
    name,
    entry: `http://localhost:${port}/remoteEntry.js`,
  };
  writeJson(tree, configPath, config);
}

function wireIntoShellApp(
  tree: Tree,
  name: string,
  className: string,
  displayName: string,
): void {
  const appPath = 'apps/shell/src/App.tsx';

  replaceOnce(
    tree,
    appPath,
    `const Lead = lazyProvider<{ runtime: CmsRuntime }>('lead', 'App');`,
    `const Lead = lazyProvider<{ runtime: CmsRuntime }>('lead', 'App');\n` +
      `const ${className} = lazyProvider<{ runtime: CmsRuntime }>('${name}', 'App');`,
  );

  {
    const content = tree.read(appPath, 'utf-8') ?? '';
    const match = content.match(
      /const MFE_ROUTE_PATHS = new Set\(\[([^\]]*)\]\);/,
    );
    if (!match) {
      throw new Error(
        `remote-app generator: expected "const MFE_ROUTE_PATHS = new Set([...]);" not found in ${appPath}. ` +
          `Update the generator's MFE_ROUTE_PATHS pattern in tools/generators/remote-app/generator.ts to match.`,
      );
    }
    tree.write(
      appPath,
      content.replace(
        match[0],
        `const MFE_ROUTE_PATHS = new Set([${match[1]}, '/${name}']);`,
      ),
    );
  }

  replaceOnce(
    tree,
    appPath,
    `        {ALL_NAV_ROUTES.filter((route) => !MFE_ROUTE_PATHS.has(route.path)).map(`,
    `        <Route\n` +
      `          path="/${name}/*"\n` +
      `          element={\n` +
      `            <ProviderBoundary name="${displayName}">\n` +
      `              <${className} runtime={mfeRuntime} />\n` +
      `            </ProviderBoundary>\n` +
      `          }\n` +
      `        />\n` +
      `        {ALL_NAV_ROUTES.filter((route) => !MFE_ROUTE_PATHS.has(route.path)).map(`,
  );
}

function wireIntoEslintBoundaries(tree: Tree, name: string): void {
  const eslintPath = 'eslint.config.mjs';
  replaceOnce(
    tree,
    eslintPath,
    `            {\n              sourceTag: 'scope:shared',\n              onlyDependOnLibsWithTags: ['scope:shared'],\n            },`,
    `            {\n` +
      `              sourceTag: 'scope:${name}',\n` +
      `              onlyDependOnLibsWithTags: ['scope:${name}', 'scope:shared'],\n` +
      `            },\n` +
      `            {\n              sourceTag: 'scope:shared',\n              onlyDependOnLibsWithTags: ['scope:shared'],\n            },`,
  );
}

function wireIntoRootScripts(tree: Tree, name: string): void {
  const pkg = readJson<{ scripts: Record<string, string> }>(
    tree,
    'package.json',
  );

  const devMatch = pkg.scripts.dev.match(/--projects=([\w,-]+)/);
  if (!devMatch) {
    throw new Error(
      `remote-app generator: expected "--projects=..." not found in the root "dev" script. ` +
        `Update wireIntoRootScripts in tools/generators/remote-app/generator.ts to match.`,
    );
  }
  pkg.scripts.dev = pkg.scripts.dev.replace(
    devMatch[0],
    `--projects=${devMatch[1]},${name}`,
  );

  const buildMatch = pkg.scripts.build.match(/--projects=([\w,-]+)/);
  if (!buildMatch) {
    throw new Error(
      `remote-app generator: expected "--projects=..." not found in the root "build" script. ` +
        `Update wireIntoRootScripts in tools/generators/remote-app/generator.ts to match.`,
    );
  }
  const buildProjects = buildMatch[1].split(',');
  const shellIndex = buildProjects.indexOf('shell');
  if (shellIndex === -1) {
    throw new Error(
      `remote-app generator: expected "shell" in the root "build" script's --projects list. ` +
        `Update wireIntoRootScripts in tools/generators/remote-app/generator.ts to match.`,
    );
  }
  buildProjects.splice(shellIndex, 0, name);
  pkg.scripts.build = pkg.scripts.build.replace(
    buildMatch[0],
    `--projects=${buildProjects.join(',')}`,
  );

  writeJson(tree, 'package.json', pkg);
}

export default async function remoteAppGenerator(
  tree: Tree,
  options: RemoteAppGeneratorSchema,
) {
  const { name, className } = names(options.name);
  if (name === 'shell') {
    throw new Error('remote-app generator: "shell" is reserved for the host app.');
  }
  if (tree.exists(`apps/${name}`)) {
    throw new Error(`remote-app generator: apps/${name} already exists.`);
  }

  const displayName = options.displayName ?? titleCase(name);
  const port = options.port ?? nextFreePort(tree);

  const rootPkg = readJson<{ dependencies: Record<string, string> }>(
    tree,
    'package.json',
  );

  generateFiles(tree, joinPathFragments(currentDir, 'files'), `apps/${name}`, {
    name,
    displayName,
    port,
    reactVersion: rootPkg.dependencies.react,
    reactDomVersion: rootPkg.dependencies['react-dom'],
    reactQueryVersion: rootPkg.dependencies['@tanstack/react-query'],
  });

  wireIntoShellConfig(tree, name, port);
  wireIntoShellApp(tree, name, className, displayName);
  wireIntoEslintBoundaries(tree, name);
  wireIntoRootScripts(tree, name);

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
    // eslint-disable-next-line no-console
    console.log(
      `\nremote-app "${name}" created on port ${port}.\n\n` +
        `Run it:\n` +
        `  npx nx serve ${name}        # standalone, http://127.0.0.1:${port}\n` +
        `  npx nx run-many -t serve --projects=shell,${name} --parallel=2   # via the shell\n\n` +
        `One manual step remains — the sidebar has no entry for "${displayName}" yet\n` +
        `because that's a design decision (icon, section, label), not a mechanical one.\n` +
        `Route "/${name}" already works if you type the URL directly. To add it to the\n` +
        `sidebar, add an entry to apps/shell/src/components/nav-config.tsx, e.g.:\n` +
        `  { icon: SomeIcon, label: '${displayName}', path: '/${name}' }\n` +
        `(pick an existing icon from libs/ui/src/icons, or hand-trace a new one\n` +
        `following the createFigmaIcon pattern — see coding-standards.md).\n`,
    );
  };
}
