import type { Meta, StoryObj } from '@storybook/react-vite';
import { Body } from './body';
import { BodySmall } from './body-small';
import { Heading1 } from './heading-1';
import { Heading2 } from './heading-2';
import { Heading3 } from './heading-3';
import { Heading4 } from './heading-4';
import { THEME_COLORS } from '../../../theme/style.constants';
import type { ThemeColor } from '../../../theme/style.types';

/** The control offers every role in the theme; nothing is listed by hand here. */
const colors = THEME_COLORS;

/** A readable slice for the swatch story, drawn from the theme's own roles. */
const textRoles = [
  'heading',
  'foreground',
  'foreground-muted',
  'foreground-subtle',
  'label',
  'primary',
  'primary-strong',
  'action',
  'link',
  'success-strong',
  'warning-foreground',
  'destructive-strong',
] as const satisfies readonly ThemeColor[];

const meta = {
  title: 'Components/Typography',
  component: Heading1,
  tags: ['autodocs'],
  args: { children: 'Business Units & Break 2' },
  argTypes: {
    bold: { control: 'boolean' },
    color: { control: 'select', options: colors },
    isUpperCase: { control: 'boolean' },
    italic: { control: 'boolean' },
    truncationEnabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Heading1>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every level of the scale, in order. */
export const Scale: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Heading1 {...args}>Heading1 — screen title</Heading1>
      <Heading2 {...args}>Heading2 — section heading</Heading2>
      <Heading3 {...args}>Heading3 — panel heading</Heading3>
      <Heading4 {...args}>Heading4 — compact heading</Heading4>
      <Body {...args}>
        Body — manage your Business Units (BU) and a secondary organizational
        break for reporting, routing and analytics.
      </Body>
      <BodySmall {...args}>
        BodySmall — secondary description, helper copy, and metadata.
      </BodySmall>
    </div>
  ),
};

/** Each prop applied on its own, so the effect of each is visible. */
export const Props: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Body>Default</Body>
      <Body bold>bold</Body>
      <Body italic>italic</Body>
      <Body isUpperCase>isUpperCase</Body>
      <Body color="destructive-strong">
        color=&quot;destructive-strong&quot;
      </Body>
      <Body color="foreground-muted">color=&quot;foreground-muted&quot;</Body>
      <Body bold isUpperCase italic color="primary">
        combined
      </Body>
    </div>
  ),
};

/**
 * `color` accepts any semantic role from the theme. Omitting it inherits the
 * surrounding surface colour.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <BodySmall>no color prop — inherits the surface</BodySmall>
      {textRoles.map((color) => (
        <BodySmall color={color} key={color}>
          {color}
        </BodySmall>
      ))}
    </div>
  ),
};

/** `truncationEnabled` clamps to one line, including inside a flex row. */
export const Truncation: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="w-64 rounded-md border border-divider p-3">
        <Heading3 truncationEnabled>
          A very long business unit name that will not fit on one line
        </Heading3>
      </div>
      <div className="flex w-64 items-center gap-2 rounded-md border border-divider p-3">
        <BodySmall truncationEnabled>
          Truncating inside a flex row alongside a fixed element
        </BodySmall>
        <span className="shrink-0 text-caption text-foreground-subtle">
          LOC
        </span>
      </div>
    </div>
  ),
};

/** `id` reaches the rendered element, so labels and anchors can target it. */
export const WithId: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Heading2 id="bu-section-heading">Business Units (BU)</Heading2>
      <BodySmall color="foreground-subtle">
        Rendered as &lt;h2 id=&quot;bu-section-heading&quot;&gt;
      </BodySmall>
    </div>
  ),
};
