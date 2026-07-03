<?php

namespace App\Http\Controllers\Admin\Chat;

use App\Ai\Agents\AdminChatAgent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Chat\SendChatMessageRequest;
use Illuminate\Http\JsonResponse;

class SendChatMessageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(SendChatMessageRequest $request): JsonResponse
    {
        $response = AdminChatAgent::make(messages: $request->history())
            ->prompt($request->validated('message'));

        return response()->json([
            'message' => [
                'role' => 'assistant',
                'content' => (string) $response,
            ],
        ]);
    }
}
