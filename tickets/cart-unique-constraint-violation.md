# Bug: Cart creation fails with UniqueConstraintViolation on user_id

## Summary

`GET /api/cart` returns 500 when a cart already exists for the authenticated user. The API attempts to `INSERT INTO carts` with a `user_id` that already has a cart, violating the unique constraint.

## Error

```
Illuminate\Database\UniqueConstraintViolationException
SQLSTATE[23000]: Integrity constraint violation: 19 UNIQUE constraint failed: carts.user_id
(Connection: sqlite, SQL: insert into "carts"...)
```

## Steps to Reproduce

1. Log in as any user who already has a cart
2. `GET /api/cart`
3. 500 error

## Expected Behavior

The endpoint should return the existing cart (using `firstOrCreate` or similar) instead of always trying to insert a new one.

## Source

Found via Telescope: `App\Http\Controllers\Web\CartController@index` on the API project.

## Priority

High — blocks all cart and checkout flows for returning users.
