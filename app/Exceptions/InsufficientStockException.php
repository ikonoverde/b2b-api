<?php

namespace App\Exceptions;

use RuntimeException;

class InsufficientStockException extends RuntimeException
{
    public function __construct(int $productId)
    {
        parent::__construct("Insufficient stock for product [{$productId}].");
    }
}
