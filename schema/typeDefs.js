const gql = require('graphql-tag')
module.exports = gql`
  type ColorType {
    discount: Int
    sellPrice: Float
    slug: String
    group: String
    color: String
    idx: Int
    images: [String]
    quantity: Int
    price: Float
    available: Boolean
    main_image: String
    model: String
    name: String
    similar: [ProductType]
    description_short: String
  }

  type AttributeProductType {
    attribute_id: String
    product_id: String
    value: String
  }

  type AddressType {
    street: String
    city: String
    state: String
    fullname: String
    instructions: String
    address: String
  }

  type Breadcrumb {
    name: String
    href: String
    last: Boolean
  }
  type CategoryType {
    id: String
    name: String
    description: String
    meta_title: String
    meta_description: String
    parent_id: String
    slug: String
    productFeed(
      cursor: CursorInput
      colors: [String]
      materials: [String]
      price: PriceInput
    ): ProductFeed
    products: [ProductType]
    subcategories: [CategoryType]
    parent: CategoryType
    breadcrumbs: [Breadcrumb]
  }

  type OptionType {
    name: String
    description: String
    picture_id: String
  }

  type ImageType {
    color: String
    image: String
  }

  type ProductType {
    _id: String
    breadcrumbs: [Breadcrumb]
    name: String
    available: Boolean
    quantity: Int
    availableColors: [ColorType]
    dimensions: [Int]
    model: String
    main_image: String
    description_short: String
    description: String
    discount: Int
    sellPrice: Float
    material: String
    style: String
    meta_title: String
    meta_description: String
    slug: String
    price: Float
    createdAt: String
    color: String
    colors: [ColorType]
    variations: [ColorType]
    similar: [ProductType]
    images: [String]
  }

  type ProductFeed {
    cursor: Cursor
    products: [ProductType]
    hasMore: Boolean
  }

  type OrderItemType {
    model: String
    quantity: Int
    price: Float
    amount: Float
    discount: Float
  }

  type CustomerDetailsType {
    name: String
    lastname: String
    email: String
    address: String
    city: String
    telephone: String
  }

  enum Courier {
    ECONT
    SPEEDY
  }

  enum DeliveryMethod {
    OFFICE
    ADDRESS
  }

  type delivery {
    courier: Courier
    method: DeliveryMethod
  }

  type OrderType {
    order_items: [OrderItemType]
    customer_details: CustomerDetailsType
    comment: String
    delivery: delivery
    amount: Float
    createdAt: String
    customer_id: String
    address: AddressType
  }

  type CartType {
    products: [CartProductType]
    price: Float
    quantity: Int
  }

  type CartProductType {
    product: ProductType
    quantity: Int
    price: String
  }

  type UserType {
    id: String
    name: String
    lastname: String
    email: String
    password: String
    attribute_ids: [String]
    attributes: [AttributeProductType]
    orders: [OrderType]
    addresses: [AddressType]
    cart: CartType
  }

  type ViewerType {
    allCategories: [CategoryType]
  }

  type Cursor {
    model: String
    createdAt: String
  }
  input CursorInput {
    model: String
    createdAt: String
  }

  type Query {
    viewer: ViewerType
    loggedInUser: UserType
    users: [UserType]
    cart: CartType
    allCategories: [CategoryType]
    getCategory(
      slug: String!
      colors: [String]
      cursor: CursorInput
      materials: [String]
      price: PriceInput
    ): CategoryType
    getProduct(model: String!, referer: String): ProductType
    getProducts(
      colors: [String]
      cursor: CursorInput
      material: String
      price: PriceInput
      search: String
      limit: Int
    ): ProductFeed
    getRouteType(slug: String!): String
  }

  input AddressInput {
    street: String
    address: String
    city: String
    state: String
    fullname: String
    instructions: String
  }
  input UserInputType {
    firstname: String
  }

  type Mutation {
    register(
      name: String!
      lastname: String!
      email: String!
      consent: Boolean!
      password: String!
    ): UserType
    addUser(firstname: String!, age: Int!, companyId: String): UserType
    addAddress(adress: AddressInput): AddressType
    modifyCart(model: String, quantity: Int): CartType
    addToCart(model: String, quantity: Int): CartType
    removeItemFromCart(model: String): CartType
    deleteUser(id: String!): UserType
    checkout(
      email: String
      address: AddressInput
      comment: String
      delivery: String
      courier: String
      telephone: String
    ): Boolean
    logout: Boolean
  }

  input PriceInput {
    max: Float
    min: Float
  }
`
