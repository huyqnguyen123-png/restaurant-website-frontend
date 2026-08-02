export interface PickupOrderItemRequest {
  menuItemId: number
  quantity: number
}

export interface CreatePickupOrderRequest {
  customerName: string
  phone: string
  pickupTime: string // "2026-08-05T18:30:00"
  items: PickupOrderItemRequest[]
  notes?: string
}

export interface PickupOrderItemResponseData {
  itemName: string
  unitPrice: number
  quantity: number
}

export interface PickupOrderResponse {
  id: number
  customerName: string
  phone: string
  pickupTime: string
  totalAmount: number
  items: PickupOrderItemResponseData[]
  createdAt: string
}