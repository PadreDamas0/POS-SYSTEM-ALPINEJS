// db management
const AlpineDatabase = {
  users: [
    {
      id: 1,
      username: "superadmin",
      email: "super@dambalasek.com",
      password: "superadmin123",
      role: "superadmin",
      status: "active",
      date_added: new Date().toISOString(),
    },
    {
      id: 2,
      username: "cashier1",
      email: "cashier@dambalasek.com",
      password: "cashier123",
      role: "cashier",
      status: "active",
      date_added: new Date().toISOString(),
    },
  ],

  products: [
    { id: 1, name: "Fried Chicken", price: 150, image_path: "/crispy-fried-chicken.png" },
    { id: 2, name: "Adobo", price: 120, image_path: "/adobo-rice.jpg" },
    { id: 3, name: "Sinigang", price: 140, image_path: "/sinigang.jpg" },
    { id: 4, name: "Lumpia", price: 80, image_path: "/lumpia.jpg" },
    { id: 5, name: "Tinola", price: 130, image_path: "/tinola-soup.jpg" },
    { id: 6, name: "Rice", price: 30, image_path: "/cooked-white-rice.jpg" },
    { id: 7, name: "Beverages", price: 50, image_path: "/beverage-drink.jpg" },
    { id: 8, name: "Dessert", price: 60, image_path: "/dessert-cake.png" },
  ],

  orders: [],
  nextOrderNumber: 1000,

  getUserByUsername(username) {
    return this.users.find((u) => u.username === username)
  },

  getAllUsers() {
    return this.users
  },

  getAllProducts() {
    return this.products
  },

  getOrders() {
    return this.orders
  },

  updateUserStatus(userId, status) {
    const user = this.users.find((u) => u.id === userId)
    if (user) {
      user.status = status
    }
  },

  createOrder(items, total, payment, userId) {
    const order = {
      order_number: "ORD-" + this.nextOrderNumber++,
      items: items,
      total_amount: total,
      payment_amount: payment,
      change_amount: payment - total,
      user_id: userId,
      date_added: new Date().toISOString(),
    }
    this.orders.push(order)
    return order
  },
}
