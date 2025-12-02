// Alpine.js Application
const AlpineDatabase = {
  getAllUsers: () => [],
  getAllProducts: () => [],
  getOrders: () => [],
  getUserByUsername: (username) => null,
  createOrder: (cart, cartTotal, paymentAmount, userId) => ({
    order_number: "",
    total_amount: cartTotal,
    payment_amount: paymentAmount,
    change_amount: paymentAmount - cartTotal,
    items: cart,
  }),
  updateUserStatus: (userId, status) => {},
}

function POSApp() {
  return {
    currentPage: "login",
    currentUser: null,
    users: [],
    products: [],
    orders: [],
    cart: [],
    paymentAmount: 0,
    showReceipt: false,
    receiptHTML: "",
    loginForm: {
      username: "",
      password: "",
    },

    get cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.qty * item.price, 0)
    },

    get totalRevenue() {
      return this.orders.reduce((sum, order) => sum + order.total_amount, 0)
    },

    init() {
      this.users = AlpineDatabase.getAllUsers()
      this.products = AlpineDatabase.getAllProducts()
      this.orders = AlpineDatabase.getOrders()

      const savedUser = sessionStorage.getItem("current_user")
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser)
        this.loadUserPage()
      } else {
        this.currentPage = "login"
      }
    },

    handleLogin() {
      const user = AlpineDatabase.getUserByUsername(this.loginForm.username)

      if (!user) {
        alert("User not found")
        return
      }

      if (user.password !== this.loginForm.password) {
        alert("Invalid password")
        return
      }

      if (user.status !== "active") {
        alert("User account is suspended")
        return
      }

      this.currentUser = user
      sessionStorage.setItem("current_user", JSON.stringify(user))
      this.loginForm = { username: "", password: "" }
      this.loadUserPage()
    },

    loadUserPage() {
      if (this.currentUser.role === "superadmin") {
        this.currentPage = "admin"
      } else {
        this.currentPage = "pos"
      }
    },

    addToCart(productId, name, price) {
      const existing = this.cart.find((item) => item.id === productId)
      if (existing) {
        existing.qty += 1
      } else {
        this.cart.push({ id: productId, name, price, qty: 1 })
      }
    },

    removeFromCart(index) {
      this.cart.splice(index, 1)
    },

    clearCart() {
      this.cart = []
      this.paymentAmount = 0
    },

    processOrder() {
      if (this.cart.length === 0) {
        alert("Cart is empty")
        return
      }

      if (this.paymentAmount < this.cartTotal) {
        alert("Not enough payment!")
        return
      }

      const order = AlpineDatabase.createOrder(this.cart, this.cartTotal, this.paymentAmount, this.currentUser.id)
      this.orders = AlpineDatabase.getOrders()
      this.generateReceipt(order)
      this.clearCart()
    },

    generateReceipt(order) {
      let html = '<div class="receipt-items">'
      order.items.forEach((item) => {
        html += `<div class="receipt-item"><span>${item.name} x${item.qty}</span><span>₱${(item.qty * item.price).toFixed(2)}</span></div>`
      })
      html += "</div>"
      html += `<div class="receipt-summary">
        <div><span>Order #:</span><span>${order.order_number}</span></div>
        <div><span>Subtotal:</span><span>₱${order.total_amount.toFixed(2)}</span></div>
        <div><span>Payment:</span><span>₱${order.payment_amount.toFixed(2)}</span></div>
        <div style="font-size: 1.1rem; border-top: 1px solid #ddd; padding-top: 10px;"><span>Change:</span><span>₱${order.change_amount.toFixed(2)}</span></div>
      </div>`

      this.receiptHTML = html
      this.showReceipt = true
    },

    suspendUser(userId) {
      if (confirm("Suspend this user?")) {
        AlpineDatabase.updateUserStatus(userId, "suspended")
        this.users = AlpineDatabase.getAllUsers()
      }
    },

    activateUser(userId) {
      if (confirm("Activate this user?")) {
        AlpineDatabase.updateUserStatus(userId, "active")
        this.users = AlpineDatabase.getAllUsers()
      }
    },

    handleLogout() {
      sessionStorage.removeItem("current_user")
      this.currentUser = null
      this.currentPage = "login"
      this.cart = []
      this.loginForm = { username: "", password: "" }
    },
  }
}
