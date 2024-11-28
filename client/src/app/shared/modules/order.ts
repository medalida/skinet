export type Order = {
    id: number
    orderDate: string
    orderStatus: string
    buyerEmail: string
    shippingAddress: ShippingAddress
    shippingPrice: number
    deliveryMethod: string
    paymentSummary: PaymentSummary
    orderItems: OrderItem[]
    subtotal: number
    total: number
  }
  
  export type ShippingAddress = {
    name: string
    line1: string
    line2: any
    city: string
    state: string
    postalCode: string
    country: string
  }
  
  export type PaymentSummary = {
    last4: number
    brand: string
    expMonth: number
    expYear: number
  }
  
  export type OrderItem = {
    id: number
    productName: string
    pictureUrl: string
    price: number
    quantity: number
  }

  export type OrderToCrete = {
    cartId: string
    shippingAddress: ShippingAddress
    deliveryMethodId?: number
    paymentSummary: PaymentSummary
  }
  