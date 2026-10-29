import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import type { CmsRuntime } from '@cms/platform-contract';
import { RouteBoundary } from './shared/component';
import { RemoteErrorBoundary } from './error-boundary';
import './styles.css';

const SetupPage = lazy(() =>
  import('./pages/SetupPage').then((module) => ({ default: module.SetupPage })),
);
const CompanySettingsPage = lazy(() =>
  import('./pages/CompanySettingsPage').then((module) => ({
    default: module.CompanySettingsPage,
  })),
);
const ZonePostalCodePage = lazy(() =>
  import('./pages/ZonePostalCodePage').then((module) => ({
    default: module.ZonePostalCodePage,
  })),
);
const BusinessUnitPage = lazy(() =>
  import('./pages/BusinessUnitPage').then((module) => ({
    default: module.BusinessUnitPage,
  })),
);
const BusinessTypePage = lazy(() =>
  import('./pages/BusinessTypePage').then((module) => ({
    default: module.BusinessTypePage,
  })),
);
const TaxSetupPage = lazy(() =>
  import('./pages/TaxSetupPage').then((module) => ({
    default: module.TaxSetupPage,
  })),
);

const TradeSkillsPage = lazy(() =>
  import('./pages/TradeSkillsPage').then((module) => ({
    default: module.TradeSkillsPage,
  })),
);
const WorkOrderBookingPage = lazy(() =>
  import('./pages/WorkOrderBookingPage').then((module) => ({
    default: module.WorkOrderBookingPage,
  })),
);
const JobTypePage = lazy(() =>
  import('./pages/JobTypePage').then((module) => ({
    default: module.JobTypePage,
  })),
);
const BillingCategoryPage = lazy(() =>
  import('./pages/BillingCategoryPage').then((module) => ({
    default: module.BillingCategoryPage,
  })),
);
const ResolutionCodePage = lazy(() =>
  import('./pages/ResolutionCodePage').then((module) => ({
    default: module.ResolutionCodePage,
  })),
);
const TagsPage = lazy(() =>
  import('./pages/TagsPage').then((module) => ({
    default: module.TagsPage,
  })),
);
const StandardDescriptionPage = lazy(() =>
  import('./pages/StandardDescriptionPage').then((module) => ({
    default: module.StandardDescriptionPage,
  })),
);
const TimeslotPage = lazy(() =>
  import('./pages/TimeslotPage').then((module) => ({
    default: module.TimeslotPage,
  })),
);
const SourcePage = lazy(() =>
  import('./pages/SourcePage').then((module) => ({
    default: module.SourcePage,
  })),
);
const PaymentMethodPage = lazy(() =>
  import('./pages/PaymentMethodPage').then((module) => ({
    default: module.PaymentMethodPage,
  })),
);
const SalesPipelineStatusPage = lazy(() =>
  import('./pages/SalesPipelineStatusPage').then((module) => ({
    default: module.SalesPipelineStatusPage,
  })),
);
const SalesActivitiesPage = lazy(() =>
  import('./pages/SalesActivitiesPage').then((module) => ({
    default: module.SalesActivitiesPage,
  })),
);

const UsersPage = lazy(() =>
  import('./pages/UsersPage').then((module) => ({
    default: module.UsersPage,
  })),
);
const EmployeesPage = lazy(() =>
  import('./pages/EmployeesPage').then((module) => ({
    default: module.EmployeesPage,
  })),
);
const RolesPermissionsPage = lazy(() =>
  import('./pages/RolesPermissionsPage').then((module) => ({
    default: module.RolesPermissionsPage,
  })),
);
const AddEmployeePage = lazy(() =>
  import('./pages/AddEmployeePage').then((module) => ({
    default: module.AddEmployeePage,
  })),
);

export interface AppProps {
  runtime: CmsRuntime;
}

export const App = ({ runtime }: AppProps) => (
  <RemoteErrorBoundary>
    <div
      className="flex min-h-0 flex-1 flex-col"
      data-tenant={runtime.tenantId}
    >
      <Routes>
        <Route
          index
          element={
            <RouteBoundary>
              <SetupPage />
            </RouteBoundary>
          }
        />
        <Route
          path="company/general-info"
          element={
            <RouteBoundary>
              <CompanySettingsPage
                companyId={runtime.currentUser.companyId}
                queryClient={runtime.queryClient}
              />
            </RouteBoundary>
          }
        />
        <Route
          path="company/zone-postal-code"
          element={
            <RouteBoundary>
              <ZonePostalCodePage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
        />
        <Route
          path="company/business-unit"
          element={
            <RouteBoundary>
              <BusinessUnitPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
        />
        <Route
          path="company/business-type"
          element={
            <RouteBoundary>
              <BusinessTypePage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
        />
        <Route
          element={
            <RouteBoundary>
              <TaxSetupPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="company/tax"
        />
        <Route
          element={
            <RouteBoundary>
              <JobTypePage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="operations/job-type"
        />
        <Route
          element={
            <RouteBoundary>
              <BillingCategoryPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="operations/billing-category"
        />
        <Route
          element={
            <RouteBoundary>
              <ResolutionCodePage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="operations/resolution-codes"
        />
        <Route
          element={
            <RouteBoundary>
              <TagsPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="operations/tags"
        />
        <Route
          element={
            <RouteBoundary>
              <StandardDescriptionPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="operations/standard-description"
        />
        <Route
          element={
            <RouteBoundary>
              <TimeslotPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="operations/timeslots"
        />
        <Route
          element={
            <RouteBoundary>
              <SourcePage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="sales/source"
        />
        <Route
          element={
            <RouteBoundary>
              <PaymentMethodPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="billing/payment-methods"
        />
        <Route
          element={
            <RouteBoundary>
              <SalesPipelineStatusPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="sales/sales-pipeline-status"
        />
        <Route
          element={
            <RouteBoundary>
              <SalesActivitiesPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="sales/sales-activities"
        />
        <Route
          element={
            <RouteBoundary>
              <TradeSkillsPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="operations/trade-skills"
        />
        <Route
          element={
            <RouteBoundary>
              <WorkOrderBookingPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="operations/work-order-booking"
        />
        <Route
          element={
            <RouteBoundary>
              <UsersPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="users-and-payroll/users"
        />
        <Route
          element={
            <RouteBoundary>
              <EmployeesPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="users-and-payroll/employees"
        />
        <Route
          element={
            <RouteBoundary>
              <RolesPermissionsPage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="users-and-payroll/roles-permissions"
        />
        <Route
          element={
            <RouteBoundary>
              <AddEmployeePage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="users-and-payroll/employees/new"
        />
        <Route
          element={
            <RouteBoundary>
              <AddEmployeePage queryClient={runtime.queryClient} />
            </RouteBoundary>
          }
          path="users-and-payroll/employees/:employeeId"
        />
      </Routes>
    </div>
  </RemoteErrorBoundary>
);

export default App;
