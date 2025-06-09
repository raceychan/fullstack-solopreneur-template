# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Remove unused `IconUserOff` import from `src/components/layout/data/sidebar-data.ts`
- Fix TypeScript errors in `src/components/layout/nav-user.tsx`:
  - Remove unused `useNavigate` import
  - Add null safety checks for user object using optional chaining
  - Update user property access to use correct UserProfileDto fields (`first_name`, `email` instead of non-existent `avatar`, `name`)
- Remove unused imports from `src/features/tasks/components/data-table.tsx`:
  - Remove unused `getPaginationRowModel` import
  - Remove unused `DataTablePagination` import
- Remove unused `limit` variable from `src/features/tasks/components/server-pagination.tsx`
- Remove unused `showSubmittedData` imports from:
  - `src/features/tasks/components/tasks-dialogs.tsx`
  - `src/features/tasks/components/tasks-mutate-drawer.tsx`
- Remove unused `IconCash` import from `src/features/users/data/data.ts`
- Fix incorrect type import in `src/hooks/useAuthenticatedUser.ts`:
  - Replace non-existent `PublicUser` type with `UserProfileDto`
- Remove unused devtools imports from `src/routes/__root.tsx`:
  - Remove unused `ReactQueryDevtools` import
  - Remove unused `TanStackRouterDevtools` import

### Changed
- All TypeScript compilation errors resolved, frontend now builds successfully