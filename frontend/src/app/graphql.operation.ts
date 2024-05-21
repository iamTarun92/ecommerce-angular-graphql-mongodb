import { gql } from 'apollo-angular';


const GET_CATEGORIES_QUERY = gql`
query getCategories {
  getCategories {
    _id
    name
    image
  }
}
`

const ProductQuery = gql`
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
  query GetProductById($productId: ID!) {
    getProductById(productId: $productId) {
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
const Sign_In_QUERY = gql`
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

const GetCouponByCodeQuery = gql`
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
`

const GET_COUPON_BY_CODE = gql`
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
const Get_Address_By_Email_QUERY = gql`
query GetAddressByEmail($email: String!) {
  getAddressByEmail(email: $email) {
    _id
    email
    phone
    address
    city
    state
    zip
    primary
    type
    fullName
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
  }
}
`


export { ProductQuery, GET_PRODUCT_BY_ID_QUERY, Sign_UP_QUERY, Sign_In_QUERY, GET_CATEGORIES_QUERY, GetCouponByCodeQuery, GET_COUPON_BY_CODE, GET_WISHLIST_QUERY, ADD_WISHLIST_QUERY, DELETE_WISHLIST_QUERY, Get_Address_By_Email_QUERY, ADD_ORDER_QUERY }