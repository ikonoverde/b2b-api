<?php

use App\Http\Controllers\Admin\AdProposals\IndexAdProposalsController;
use App\Http\Controllers\Admin\AdProposals\ShowAdProposalController;
use App\Http\Controllers\Admin\BlogPosts\CreateBlogPostController;
use App\Http\Controllers\Admin\BlogPosts\DestroyBlogPostController;
use App\Http\Controllers\Admin\BlogPosts\EditBlogPostController;
use App\Http\Controllers\Admin\BlogPosts\IndexBlogPostsController;
use App\Http\Controllers\Admin\BlogPosts\PreviewBlogPostController;
use App\Http\Controllers\Admin\BlogPosts\StoreBlogPostController;
use App\Http\Controllers\Admin\BlogPosts\UpdateBlogPostController;
use App\Http\Controllers\Admin\Businesses\ExportBusinessesForMetaController;
use App\Http\Controllers\Admin\Businesses\IndexBusinessesController;
use App\Http\Controllers\Admin\Businesses\StartBusinessScrapeController;
use App\Http\Controllers\Admin\Chat\SendChatMessageController;
use App\Http\Controllers\Admin\Chat\ShowChatController;
use App\Http\Controllers\Admin\GrowthPlan\BoardGrowthPlanController;
use App\Http\Controllers\Admin\GrowthPlan\ConfirmGrowthTaskClosureController;
use App\Http\Controllers\Admin\GrowthPlan\IndexGrowthPlanController;
use App\Http\Controllers\Admin\GrowthPlan\MoveGrowthTaskController;
use App\Http\Controllers\Admin\GrowthPlan\RejectGrowthTaskClosureController;
use App\Http\Controllers\Admin\GrowthPlan\ReopenGrowthTaskController;
use App\Http\Controllers\Admin\GrowthPlan\ShowGrowthPlanController;
use App\Http\Controllers\Admin\MarketingReports\IndexMarketingReportsController;
use App\Http\Controllers\Admin\MarketingReports\ShowMarketingReportController;
use App\Http\Controllers\Admin\MeridaSampleRequests\IndexMeridaSampleRequestsController;
use App\Http\Controllers\Admin\Orders\CreateOrderRefundController;
use App\Http\Controllers\Admin\Orders\IndexOrdersController;
use App\Http\Controllers\Admin\Orders\RetryShippingLabelController;
use App\Http\Controllers\Admin\Orders\ShowOrderController;
use App\Http\Controllers\Admin\Orders\StoreOrderNoteController;
use App\Http\Controllers\Admin\Orders\UpdateOrderStatusController;
use App\Http\Controllers\Admin\Orders\UpdateOrderTrackingController;
use App\Http\Controllers\Admin\Settings\ShowSettingsController;
use App\Http\Controllers\Admin\Settings\UpdateSettingsController;
use App\Http\Controllers\Admin\SocialPosts\IndexSocialPostDraftsController;
use App\Http\Controllers\Admin\SocialPosts\PublishSocialPostDraftController;
use App\Http\Controllers\Admin\SocialPosts\RejectSocialPostDraftController;
use App\Http\Controllers\Admin\SocialPosts\ShowSocialPostDraftController;
use App\Http\Controllers\Admin\Users\IndexUsersController;
use App\Http\Controllers\Admin\Users\SendUserPasswordResetController;
use App\Http\Controllers\Admin\Users\ShowUserController;
use App\Http\Controllers\Admin\Users\ToggleUserActiveController;
use App\Http\Controllers\Admin\Users\UpdateUserRoleController;
use App\Http\Controllers\Web\Auth\LoginController;
use App\Http\Controllers\Web\BannersController;
use App\Http\Controllers\Web\CategoriesController;
use App\Http\Controllers\Web\ContentFeaturedProductsController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\Products\CreateProductController;
use App\Http\Controllers\Web\Products\DestroyProductController;
use App\Http\Controllers\Web\Products\EditProductController;
use App\Http\Controllers\Web\Products\IndexProductsController;
use App\Http\Controllers\Web\Products\StoreProductController;
use App\Http\Controllers\Web\Products\UpdateProductController;
use App\Http\Controllers\Web\StaticPagesController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
});

Route::middleware(['auth', 'role:admin,super_admin'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/products', IndexProductsController::class)->name('products');
    Route::get('/products/create', CreateProductController::class)->name('products.create');
    Route::post('/products', StoreProductController::class)->name('products.store');
    Route::get('/products/{product}/edit', EditProductController::class)->name('products.edit');
    Route::put('/products/{product}', UpdateProductController::class)->name('products.update');
    Route::delete('/products/{product}', DestroyProductController::class)->name('products.destroy');

    Route::get('/categories', [CategoriesController::class, 'index'])->name('categories');
    Route::post('/categories', [CategoriesController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoriesController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoriesController::class, 'destroy'])->name('categories.destroy');
    Route::post('/categories/reorder', [CategoriesController::class, 'reorder'])->name('categories.reorder');
    Route::patch('/categories/{category}/visibility', [CategoriesController::class, 'toggleVisibility'])
        ->name('categories.toggle-visibility');
    Route::get('/categories/{category}/stats', [CategoriesController::class, 'stats'])->name('categories.stats');

    Route::get('/featured-products', [ContentFeaturedProductsController::class, 'index'])
        ->name('featured-products');
    Route::put('/featured-products', [ContentFeaturedProductsController::class, 'update'])
        ->name('featured-products.update');

    Route::get('/banners', [BannersController::class, 'index'])->name('banners');
    Route::post('/banners', [BannersController::class, 'store'])->name('banners.store');
    Route::put('/banners/{banner}', [BannersController::class, 'update'])->name('banners.update');
    Route::delete('/banners/{banner}', [BannersController::class, 'destroy'])->name('banners.destroy');
    Route::post('/banners/reorder', [BannersController::class, 'reorder'])->name('banners.reorder');
    Route::patch('/banners/{banner}/visibility', [BannersController::class, 'toggleVisibility'])
        ->name('banners.toggle-visibility');

    Route::get('/static-pages', [StaticPagesController::class, 'index'])->name('static-pages');
    Route::get('/static-pages/{staticPage}/edit', [StaticPagesController::class, 'edit'])
        ->name('static-pages.edit');
    Route::put('/static-pages/{staticPage}', [StaticPagesController::class, 'update'])
        ->name('static-pages.update');

    Route::get('/blog-posts', IndexBlogPostsController::class)->name('blog-posts');
    Route::get('/blog-posts/create', CreateBlogPostController::class)->name('blog-posts.create');
    Route::post('/blog-posts', StoreBlogPostController::class)->name('blog-posts.store');
    Route::get('/blog-posts/{blogPost}/edit', EditBlogPostController::class)->name('blog-posts.edit');
    Route::get('/blog-posts/{blogPost}/preview', PreviewBlogPostController::class)->name('blog-posts.preview');
    Route::put('/blog-posts/{blogPost}', UpdateBlogPostController::class)->name('blog-posts.update');
    Route::delete('/blog-posts/{blogPost}', DestroyBlogPostController::class)->name('blog-posts.destroy');

    Route::get('/users', IndexUsersController::class)->name('users');
    Route::get('/users/{user}', ShowUserController::class)->name('users.show');
    Route::patch('/users/{user}/role', UpdateUserRoleController::class)->name('users.update-role');
    Route::patch('/users/{user}/toggle-active', ToggleUserActiveController::class)
        ->name('users.toggle-active');
    Route::post('/users/{user}/send-password-reset', SendUserPasswordResetController::class)
        ->name('users.send-password-reset');

    Route::get('/orders', IndexOrdersController::class)->name('orders');
    Route::get('/orders/{order}', ShowOrderController::class)->name('orders.show');
    Route::patch('/orders/{order}/status', UpdateOrderStatusController::class)->name('orders.update-status');
    Route::patch('/orders/{order}/tracking', UpdateOrderTrackingController::class)
        ->name('orders.update-tracking');
    Route::post('/orders/{order}/refund', CreateOrderRefundController::class)->name('orders.create-refund');
    Route::post('/orders/{order}/notes', StoreOrderNoteController::class)->name('orders.store-note');
    Route::post('/orders/{order}/retry-label', RetryShippingLabelController::class)
        ->name('orders.retry-label');

    Route::get('/businesses', IndexBusinessesController::class)->name('businesses');
    Route::get('/businesses/export', ExportBusinessesForMetaController::class)->name('businesses.export');
    Route::post('/businesses/scrape', StartBusinessScrapeController::class)->name('businesses.scrape');
    Route::get('/chat', ShowChatController::class)->name('chat');
    Route::post('/chat/messages', SendChatMessageController::class)->name('chat.messages');
    Route::get('/sample-requests', IndexMeridaSampleRequestsController::class)->name('sample-requests');

    Route::get('/ad-proposals', IndexAdProposalsController::class)->name('ad-proposals');
    Route::get('/ad-proposals/{adProposal}', ShowAdProposalController::class)->name('ad-proposals.show');

    Route::get('/marketing-reports', IndexMarketingReportsController::class)->name('marketing-reports');
    Route::get('/marketing-reports/{marketingReport}', ShowMarketingReportController::class)
        ->name('marketing-reports.show');

    Route::get('/growth-plan', IndexGrowthPlanController::class)->name('growth-plan');
    Route::get('/growth-plan/board', BoardGrowthPlanController::class)->name('growth-plan.board');
    Route::get('/growth-plan/runs/{growthPlan}', ShowGrowthPlanController::class)->name('growth-plan.show');
    Route::post('/growth-plan/tasks/{growthTask}/move', MoveGrowthTaskController::class)
        ->name('growth-plan.tasks.move');
    Route::post('/growth-plan/tasks/{growthTask}/confirm-closure', ConfirmGrowthTaskClosureController::class)
        ->name('growth-plan.tasks.confirm-closure');
    Route::post('/growth-plan/tasks/{growthTask}/reject-closure', RejectGrowthTaskClosureController::class)
        ->name('growth-plan.tasks.reject-closure');
    Route::post('/growth-plan/tasks/{growthTask}/reopen', ReopenGrowthTaskController::class)
        ->name('growth-plan.tasks.reopen');

    Route::get('/social-posts', IndexSocialPostDraftsController::class)->name('social-posts');
    Route::get('/social-posts/{socialPostDraft}', ShowSocialPostDraftController::class)->name('social-posts.show');
    Route::post('/social-posts/{socialPostDraft}/publish', PublishSocialPostDraftController::class)
        ->name('social-posts.publish');
    Route::post('/social-posts/{socialPostDraft}/reject', RejectSocialPostDraftController::class)
        ->name('social-posts.reject');

    Route::get('/settings', ShowSettingsController::class)->name('settings.show');
    Route::put('/settings', UpdateSettingsController::class)->name('settings.update');
});
