<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Admin\Users\Concerns\BuildsUserShowResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Response;

class ShowUserController extends Controller
{
    use BuildsUserShowResponse;

    public function __invoke(Request $request, User $user): Response
    {
        $perPage = min((int) $request->query('per_page', 15), 100);

        return $this->renderUserShow($user, $perPage);
    }
}
