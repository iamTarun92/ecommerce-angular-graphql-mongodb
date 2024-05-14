import { gql } from 'apollo-angular';


const CategoriesQuery = gql`
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
      discription
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
    categoryId
  }
}
`

const GET_PRODUCT_BY_ID = gql`
  query GetProductById($productId: ID!) {
    getProductById(productId: $productId) {
      _id
      name
      discription
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
const SignUp = gql`
mutation SignUp($username:String!, $email: String!, $password: String!) {
  signUp(newUser: { username:$username, email: $email, password: $password }) {
    username
    email
    password
  }
}
`
const SignIn = gql`
mutation SignIn($email: String!, $password: String!) {
  signIn(newUser: { email: $email, password: $password }) {
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

const GET_COUPONS = gql`
query GetCoupons {
  getCoupons {
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



export { ProductQuery, GET_PRODUCT_BY_ID, SignUp, SignIn, CategoriesQuery, GetCouponByCodeQuery, GET_COUPON_BY_CODE, GET_COUPONS }