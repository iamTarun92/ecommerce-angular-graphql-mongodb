import { gql } from 'apollo-angular';

const GET_PRODUCT_QUERY = gql`
query getProducts {
  getProducts {
    _id
    name
    description
    price
    specialPrice
    isFixedPrice
    stock
    image
    attributes {
      name
      options {
        value
        price
        description
      }
    }
    categoryId {
      _id
      name
      image
    }    
  }
}
`

const GET_PRODUCT_BY_ID_QUERY = gql`
  query GetProductById($id: ID!) {
    getProductById(id: $id) {
      _id
      name
      description
      price
      specialPrice
      isFixedPrice
      stock
      image
      attributes {
        name
        options {
          value
          price
          description
        }
      }
    }
  }
`

const Sign_UP_QUERY = gql`
mutation SignUp($username:String!, $email: String!, $password: String!) {
  signUp(newUser: { username:$username, email: $email, password: $password }) {
    username
    email
  }
}
`

const SIGN_IN_QUERY = gql`
query SignIn($email: String!, $password: String!) {
  signIn(newUser: { email: $email, password: $password }) {
    user {
      username
      email
      phone
    }
    token
  }
}
`

const GET_CATEGORIES_QUERY = gql`
query getCategories {
  getCategories {
    _id
    name
    image
  }
}
`

const GET_COUPON_BY_CODE_QUERY = gql`
  query GetCouponByCode($code: String!) {
    getCouponByCode(code: $code) {
      _id
      code
      discount
      startDate
      endDate
      minOrder
      isFixed
    }
  }
`;

const GET_WISHLIST_QUERY = gql`
query GetWishlists($email: String!) {
  getWishlists(email: $email) {
    _id
    email
    productId {
      _id
      name
      description
      price
      specialPrice
      isFixedPrice
      stock
      image
      categoryId {
        _id
        name
        image
      }
    }
  }
}
`

const ADD_WISHLIST_QUERY = gql`
mutation AddWishlist($email: String, $productId: String) {
  addWishlist(email: $email, productId: $productId) {
    _id
    email
    productId {
      _id
      name
      description
      price
      specialPrice
      isFixedPrice
      stock
      image
      categoryId {
        _id
        name
        image
      }
    }
  }
}
`

const DELETE_WISHLIST_QUERY = gql`
mutation DeleteWishlist($id: ID!) {
  deleteWishlist(id: $id) {
    _id
    email
  }
}
`

const GET_ADDRESS_BY_EMAIL_QUERY = gql`
query GetAddressByEmail($email: String!) {
  getAddressByEmail(email: $email) {
    _id
    email
    fullName
    phone
    type
    address {
      street
      city
      state
      zip
    }
  }
}
`

const ADD_ORDER_QUERY = gql`
mutation AddOrder($newOrder: OrderInput!) {
  addOrder(newOrder: $newOrder) {
    email
    orderId
    paymentMethod
    products {
      _id
      name
    }
    address {
      billing {
        email
      }
      delivery {
        email
      }
    }
    name
    transactionId
    amount
    orderStatus
    paymentStatus
  }
}
`

const GET_ORDER_BY_EMAIL = gql`
query GetOrdersByEmail($email: String!) {
  getOrdersByEmail(email: $email) {
    _id
    email
    orderId
    paymentMethod
    products {
      _id
      name
    }
    address {
      billing {
        email
      }
      delivery {
        email
      }
    }
    name
    transactionId
    amount
    orderStatus
    paymentStatus
  }
}
`

const GET_ORDER_BY_ID = gql`
query GetOrderByOrderId($orderId: String!) {
  getOrderByOrderId(orderId: $orderId) {
    _id
    email
    orderId
    paymentMethod
    products {
      _id
      name
    }
    address {
      billing {
        email
      }
      delivery {
        email
      }
    }
    name
    transactionId
    amount
    orderStatus
    paymentStatus
  }
}
`

const ADD_ADDRESS_QUERY = gql`
mutation AddAddress($newAddress: AddressInput) {
  addAddress(newAddress: $newAddress) {
    _id
    email
    fullName
    phone
    type
    address {
      street
      city
      state
      zip
    }
  }
}
`

const UPDATE_ADDRESS_QUERY = gql`
mutation UpdateAddress($id: ID!, $address: AddressInput) {
  updateAddress(id: $id, address: $address) {
    phone
  }
}
`

const DELETE_ADDRESS_QUERY = gql`
mutation DeleteAddress($id: ID!) {
  deleteAddress(id: $id) {
    _id
    email
    fullName
    phone
    type
  }
}`

const Get_Reviews_By_Product_Id_QUERY = gql`
query GetReviewsByProductId($productId: ID!) {
  getReviewsByProductId(product: $productId) {
    _id
    content
    author {
      username
      email
      phone
    }
    product {
      _id
      name
      description
      price
      specialPrice
      isFixedPrice
      stock
      image
    }
    note
  }
}`

const ADD_REVIEW_QUERY = gql`
mutation AddReview($newReview: ReviewInput) {
  addReview(newReview: $newReview) {
    _id
    content
    author {
      _id
      username
      email
      phone
    }
    note
  }
}
`

const UPDATE_REVIEW_QUERY = gql`
mutation UpdateReview($id: ID!, $review: ReviewInput) {
  updateReview(id: $id, review: $review) {
    _id
    content
    author {
      _id
      username
      email
      phone
    }
    note
  }
}
`

const Request_Password_Reset_Query = gql`
mutation RequestPasswordReset($email: String!) {
  requestPasswordReset(email: $email)
}
`
const Reset_Password_Query = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

export {
  GET_PRODUCT_QUERY,
  GET_PRODUCT_BY_ID_QUERY,
  Sign_UP_QUERY,
  SIGN_IN_QUERY,
  GET_CATEGORIES_QUERY,
  GET_COUPON_BY_CODE_QUERY,
  GET_WISHLIST_QUERY,
  ADD_WISHLIST_QUERY,
  DELETE_WISHLIST_QUERY,
  GET_ADDRESS_BY_EMAIL_QUERY,
  ADD_ORDER_QUERY,
  GET_ORDER_BY_EMAIL,
  GET_ORDER_BY_ID,
  ADD_ADDRESS_QUERY,
  UPDATE_ADDRESS_QUERY,
  DELETE_ADDRESS_QUERY,
  Get_Reviews_By_Product_Id_QUERY,
  ADD_REVIEW_QUERY,
  UPDATE_REVIEW_QUERY,
  Request_Password_Reset_Query,
  Reset_Password_Query
}