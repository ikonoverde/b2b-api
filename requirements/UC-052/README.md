# UC-052: View All Users

## Overview

| Field | Value |
|-------|-------|
| **ID** | UC-052 |
| **Name** | View All Users |
| **Section** | 2.9 Admin: User Management |
| **Actors** | Admin |
| **Priority** | Must |
| **Requirement** | REQ 5.5 (Admin Panel — User Management) |

## Description

Allows administrators to view a paginated list of all registered users in the system with sorting capabilities.

## Preconditions

- Admin is authenticated with administrator role

## Main Flow

1. Admin navigates to user management
2. System retrieves all registered users with pagination
3. System displays user list: name, email, role, status, registration date
4. Admin can sort by name, date, or role

## Postconditions

- Admin can see all registered users

## Implementation Components

### Route

`routes/web.php`

```php
Route::middleware(['auth', 'role:admin,super_admin'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('admin.users');
    });
```

### Controller

`app/Http/Controllers/Admin/UserController.php`

```php
public function index(Request $request): Response
{
    $users = User::query()
        ->orderBy($request->get('sort_by', 'created_at'), $request->get('sort_order', 'desc'))
        ->paginate($request->get('per_page', 15));

    return inertia('Admin/Users/Index', [
        'users' => $users,
    ]);
}
```

### Frontend Page

`resources/js/pages/admin/users/Index.tsx`

```tsx
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

interface Props extends PageProps {
    users: {
        data: User[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export default function UsersIndex() {
    const { users } = usePage<Props>().props;

    return (
        <div>
            <h1>User Management</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Registered</th>
                    </tr>
                </thead>
                <tbody>
                    {users.data.map((user) => (
                        <tr key={user.id}>
                            <td>{user.first_name} {user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

## Data Model

### User Fields

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| first_name | string | User's first name |
| last_name | string | User's last name |
| email | string | User's email (unique) |
| phone | string\|null | Optional phone number |
| role | string | User role: customer, admin, super_admin |
| is_active | boolean | Account status |
| created_at | timestamp | Registration date |
| updated_at | timestamp | Last update |

## Query Parameters

| Parameter | Type | Required | Default | Constraints | Description |
|-----------|------|----------|---------|-------------|-------------|
| page | integer | No | 1 | min:1 | Page number for pagination |
| per_page | integer | No | 15 | min:1, max:100 | Items per page |
| sort_by | string | No | created_at | one of: first_name, last_name, email, role, created_at | Field to sort by |
| sort_order | string | No | desc | one of: asc, desc | Sort direction |

## Business Rules

1. Only users with role `admin` or `super_admin` can access this page
2. Default pagination is 15 items per page
3. Maximum allowed per_page is 100
4. Default sort is by `created_at` in descending order
5. Deactivated users (`is_active = false`) are still visible in the list

## Related Use Cases

- UC-053: Search Users (filtering)
- UC-054: View User Details
- UC-055: Activate/Deactivate User Account
- UC-056: Assign User Roles
