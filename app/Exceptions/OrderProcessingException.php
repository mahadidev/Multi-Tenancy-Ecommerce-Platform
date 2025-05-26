<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrderProcessingException extends Exception
{
    /**
     * Additional error data
     *
     * @var array
     */
    protected $data;

    /**
     * Create a new exception instance
     *
     * @param string $message
     * @param array $data
     * @param int $code
     */
    public function __construct(string $message = 'Order processing failed', array $data = [], int $code = 422)
    {
        parent::__construct($message, $code);
        $this->data = $data;
    }

    /**
     * Render the exception into an HTTP response
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'errors' => $this->data,
        ], $this->getCode());
    }

    /**
     * Report the exception
     *
     * @return void
     */
    public function report(): void
    {
        // Custom reporting logic if needed
        // Example: Log to a specific channel
        \Log::channel('orders')->error($this->getMessage(), [
            'exception' => $this,
            'data' => $this->data,
        ]);
    }
}
