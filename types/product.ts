export interface Product {
  product_id: string
  related_product_id: string
  product_name: string
  product_number: string
  barcode: string
  colors: number[]
  sizes: number[]
  description: string
  webshop_description: string
  product_image: string
  product_thumb_big: string
  product_thumb_small: string
  in_stock?: boolean // Optional
  stock_quantity?: number // Optional
  images: Array<{
    product_image: string
    product_thumb_big: string
    product_thumb_small: string
    product_thumb_large: string
    color_id?: number
  }>
  brand_id: string
  brand_name: string
  category_id: string
  category_name: string
  supplier_id: string
  supplier_name: string
  supplier_code: string | null
  vatrate_id: string
  vatrate_percent: string
  cost_price: string
  price_inc_vat: string
  special_price: string
  currency_code: string
  created_at: string
  updated_at: string
  color_variants?: Array<{
    color_id: number
    price_inc_vat: string
    special_price?: string
    product_image: string
    in_stock?: boolean // Optional
    stock_quantity?: number // Optional
  }>
}