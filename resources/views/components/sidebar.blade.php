@props(['active' => 'dashboard'])

<aside class="w-[260px] min-h-screen bg-sidebar-bg flex flex-col justify-between py-8 px-6">
    <!-- Logo Section -->
    <div>
        <div class="mb-8">
            <h1 class="text-sidebar-text font-heading text-xl font-bold tracking-[2px]">IKONO VERDE</h1>
            <p class="text-sidebar-muted font-heading text-[10px] font-semibold tracking-[3px]">ADMIN PANEL</p>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-col gap-1 pt-8">
            <a href="{{ route('dashboard') }}"
               class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ $active === 'dashboard' ? 'bg-white/20 text-sidebar-text font-medium' : 'text-sidebar-muted hover:bg-white/10 hover:text-sidebar-text' }}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
                </svg>
                <span class="text-sm">Dashboard</span>
            </a>

            <a href="{{ Route::has('orders.index') ? route('orders.index') : '#' }}"
               class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ $active === 'orders' ? 'bg-white/20 text-sidebar-text font-medium' : 'text-sidebar-muted hover:bg-white/10 hover:text-sidebar-text' }}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
                </svg>
                <span class="text-sm">Orders</span>
            </a>

            <a href="{{ Route::has('products.index') ? route('products.index') : '#' }}"
               class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ $active === 'products' ? 'bg-white/20 text-sidebar-text font-medium' : 'text-sidebar-muted hover:bg-white/10 hover:text-sidebar-text' }}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>
                </svg>
                <span class="text-sm">Products</span>
            </a>

            <a href="{{ Route::has('customers.index') ? route('customers.index') : '#' }}"
               class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ $active === 'customers' ? 'bg-white/20 text-sidebar-text font-medium' : 'text-sidebar-muted hover:bg-white/10 hover:text-sidebar-text' }}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span class="text-sm">Customers</span>
            </a>

            <a href="{{ Route::has('settings.index') ? route('settings.index') : '#' }}"
               class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {{ $active === 'settings' ? 'bg-white/20 text-sidebar-text font-medium' : 'text-sidebar-muted hover:bg-white/10 hover:text-sidebar-text' }}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <span class="text-sm">Settings</span>
            </a>
        </nav>
    </div>

    <!-- User Section -->
    <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-heading font-semibold text-sm">
            {{ strtoupper(substr(auth()->user()->name ?? 'U', 0, 2)) }}
        </div>
        <div class="flex-1 min-w-0">
            <p class="text-sidebar-text text-sm font-medium truncate">{{ auth()->user()->name ?? 'User' }}</p>
            <p class="text-sidebar-muted text-xs truncate">{{ auth()->user()->email ?? '' }}</p>
        </div>
    </div>
</aside>
