<x-layouts.auth title="Login">
    <div class="flex min-h-screen">
        <!-- Left Panel - Brand -->
        <div class="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-16">
            <div class="flex flex-col items-center gap-6 max-w-[400px]">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                    </div>
                    <span class="text-[32px] font-bold text-white font-heading">B2B Portal</span>
                </div>
                <p class="text-lg text-sidebar-muted text-center leading-relaxed">
                    Streamline your business operations with our comprehensive management platform.
                </p>
            </div>
        </div>

        <!-- Right Panel - Login Form -->
        <div class="w-full lg:w-[560px] flex items-center justify-center p-8 lg:p-16 bg-white">
            <div class="w-full max-w-[400px] flex flex-col gap-8">
                <!-- Header -->
                <div class="flex flex-col gap-2">
                    <h1 class="text-[32px] font-semibold text-foreground font-heading">Welcome back</h1>
                    <p class="text-base text-muted-foreground">Enter your credentials to access your account</p>
                </div>

                <!-- Form -->
                <form method="POST" action="{{ route('login') }}" class="flex flex-col gap-5">
                    @csrf

                    <!-- Email Field -->
                    <div class="flex flex-col gap-2">
                        <label for="email" class="text-sm font-medium text-foreground">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value="{{ old('email') }}"
                            placeholder="Enter your email"
                            class="h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            required
                            autofocus
                        >
                        @error('email')
                            <span class="text-sm text-error">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Password Field -->
                    <div class="flex flex-col gap-2">
                        <label for="password" class="text-sm font-medium text-foreground">Password</label>
                        <div class="relative">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                class="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                required
                            >
                            <button
                                type="button"
                                onclick="togglePassword()"
                                class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <svg id="eye-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                </svg>
                                <svg id="eye-off-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                </svg>
                            </button>
                        </div>
                        @error('password')
                            <span class="text-sm text-error">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Options Row -->
                    <div class="flex items-center justify-between">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="remember"
                                value="1"
                                {{ old('remember') ? 'checked' : '' }}
                                class="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                            >
                            <span class="text-sm text-foreground">Remember me</span>
                        </label>
                        <a href="#" class="text-sm font-medium text-primary hover:underline">Forgot password?</a>
                    </div>

                    <!-- Actions -->
                    <div class="flex flex-col gap-4 mt-4">
                        <!-- Sign In Button -->
                        <button
                            type="submit"
                            class="h-12 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                        >
                            Sign In
                        </button>

                        <!-- Divider -->
                        <div class="flex items-center gap-4">
                            <div class="flex-1 h-px bg-border"></div>
                            <span class="text-sm text-muted-foreground">or</span>
                            <div class="flex-1 h-px bg-border"></div>
                        </div>

                        <!-- Google Button -->
                        <button
                            type="button"
                            class="h-12 flex items-center justify-center gap-3 bg-background border border-border rounded-lg font-medium text-foreground hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                        >
                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                </form>

                <!-- Sign Up Link -->
                <div class="flex items-center justify-center gap-1">
                    <span class="text-sm text-muted-foreground">Don't have an account?</span>
                    <a href="#" class="text-sm font-semibold text-primary hover:underline">Sign up</a>
                </div>
            </div>
        </div>
    </div>

    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eye-icon');
            const eyeOffIcon = document.getElementById('eye-off-icon');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('hidden');
                eyeOffIcon.classList.add('hidden');
            }
        }
    </script>
</x-layouts.auth>
