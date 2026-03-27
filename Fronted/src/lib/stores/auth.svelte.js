function createAuthStore() {
    let token = $state(typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null)
    let user = $state(null)

    return {
        get token() { return token },
        get user() { return user },
        get isLoggedIn() { return !!token },

        login(newToken, userData) {
            token = newToken
            user = userData
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('token', newToken)
            }
        },

        logout() {
            token = null
            user = null
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('token')
            }
        },

        // Método para cargar datos del usuario desde el token almacenado
        async loadUser() {
            if (!token) return
            
            try {
                const response = await fetch('http://localhost:4321/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                
                if (response.ok) {
                    user = await response.json()
                } else {
                    // Token inválido, limpiar
                    this.logout()
                }
            } catch (err) {
                console.error('Error al cargar usuario:', err)
                this.logout()
            }
        }
    }
}

export const auth = createAuthStore()
