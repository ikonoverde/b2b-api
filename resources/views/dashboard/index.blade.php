<x-layouts.app :title="'Dashboard'" :active="'dashboard'">
    <div class="space-y-8">
        <!-- Header -->
        <div>
            <h1 class="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
            <p class="text-muted-foreground text-sm mt-1">Welcome back! Here's your business overview</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Orders -->
            <div class="bg-card border border-border rounded-xl p-5">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Total Orders</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    </svg>
                </div>
                <p class="font-heading text-3xl font-bold text-foreground">1,284</p>
                <p class="text-xs text-success mt-1">+4.5% from last month</p>
            </div>

            <!-- Revenue -->
            <div class="bg-card border border-border rounded-xl p-5">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Revenue</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                        <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                </div>
                <p class="font-heading text-3xl font-bold text-foreground">$48.2M</p>
                <p class="text-xs text-success mt-1">+6.1% from last month</p>
            </div>

            <!-- Customers -->
            <div class="bg-card border border-border rounded-xl p-5">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Customers</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                </div>
                <p class="font-heading text-3xl font-bold text-foreground">573</p>
                <p class="text-xs text-success mt-1">+2.3% from last month</p>
            </div>

            <!-- Products -->
            <div class="bg-card border border-border rounded-xl p-5">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Products</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
                    </svg>
                </div>
                <p class="font-heading text-3xl font-bold text-foreground">86</p>
                <p class="text-xs text-muted-foreground mt-1">3 added this month</p>
            </div>
        </div>

        <!-- Charts and Recent Orders -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <!-- Revenue Overview Chart -->
            <div class="lg:col-span-3 bg-card border border-border rounded-xl p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="font-heading text-lg font-semibold text-foreground">Revenue Overview</h2>
                    <select class="text-sm border border-border rounded-lg px-3 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                    </select>
                </div>
                <!-- Chart Placeholder -->
                <div class="h-64 flex items-end justify-between gap-4 px-2">
                    <div class="flex-1 flex flex-col items-center gap-2">
                        <div class="w-full bg-primary/30 rounded-t" style="height: 40%"></div>
                        <span class="text-xs text-muted-foreground">Mon</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                        <div class="w-full bg-primary/30 rounded-t" style="height: 55%"></div>
                        <span class="text-xs text-muted-foreground">Tue</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                        <div class="w-full bg-primary rounded-t" style="height: 85%"></div>
                        <span class="text-xs text-muted-foreground">Wed</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                        <div class="w-full bg-primary rounded-t" style="height: 70%"></div>
                        <span class="text-xs text-muted-foreground">Thu</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                        <div class="w-full bg-primary/30 rounded-t" style="height: 60%"></div>
                        <span class="text-xs text-muted-foreground">Fri</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                        <div class="w-full bg-primary rounded-t" style="height: 90%"></div>
                        <span class="text-xs text-muted-foreground">Sat</span>
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-2">
                        <div class="w-full bg-primary/30 rounded-t" style="height: 45%"></div>
                        <span class="text-xs text-muted-foreground">Sun</span>
                    </div>
                </div>
            </div>

            <!-- Recent Orders -->
            <div class="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="font-heading text-lg font-semibold text-foreground">Recent Orders</h2>
                    <a href="#" class="text-sm text-primary hover:underline">View all</a>
                </div>
                <div class="space-y-4">
                    <!-- Order Item -->
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                            <span class="text-secondary font-semibold text-sm">JB</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-foreground truncate">Josh Barnette</p>
                            <p class="text-xs text-muted-foreground">#ORD-7841</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-semibold text-foreground">$2,450</p>
                            <span class="inline-block text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Paid</span>
                        </div>
                    </div>

                    <!-- Order Item -->
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                            <span class="text-warning font-semibold text-sm">BS</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-foreground truncate">Bounty Server</p>
                            <p class="text-xs text-muted-foreground">#ORD-7840</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-semibold text-foreground">$9,890</p>
                            <span class="inline-block text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning">Pending</span>
                        </div>
                    </div>

                    <!-- Order Item -->
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span class="text-primary font-semibold text-sm">WG</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-foreground truncate">Wellness Goa</p>
                            <p class="text-xs text-muted-foreground">#ORD-7839</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-semibold text-foreground">$1,205</p>
                            <span class="inline-block text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Paid</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-layouts.app>
