import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from './App'
import { LoginPage } from './auth/LoginPage'
import { SignUpPage } from './auth/SignUpPage'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { SalesPage } from './features/sales/SalesPage'
import { InventoryPage } from './features/inventory/InventoryPage'
import { CustomersPage } from './features/customers/CustomersPage'
import { EmployeesPage } from './features/employees/EmployeesPage'
import { ReportsPage } from './features/reports/ReportsPage'
import { ForgotPasswordPage } from './auth/ForgotPasswordPage'

const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="p-6">
      Dashboard coming soon
    </div>
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignUpPage,
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
})

const salesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sales',
  component: () => <ProtectedRoute><SalesPage /></ProtectedRoute>,
})

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: () => <ProtectedRoute><InventoryPage /></ProtectedRoute>,
})

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: () => <ProtectedRoute><CustomersPage /></ProtectedRoute>,
})

const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employees',
  component: () => <ProtectedRoute><EmployeesPage /></ProtectedRoute>,
})

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: () => <ProtectedRoute><ReportsPage /></ProtectedRoute>,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  salesRoute,
  inventoryRoute,
  customersRoute,
  employeesRoute,
  reportsRoute,
  loginRoute,
  signUpRoute,
  forgotPasswordRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
