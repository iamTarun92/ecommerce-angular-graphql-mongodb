const typeDefs = `#graphql
    type Query {
      getCategories:[Category]
      getProducts:[Product]
      getProductById(productId:ID!):Product
      getStudentByFilter(name:String,age:Int): [Student]
      getMarkByFilter(student_id:ID!): [MarkFilterResult]
      getCoupons: [Coupon]
      getCouponById(id: ID!): Coupon
      getCouponByCode(code: String!): Coupon
    }
    type Mutation {
      signUp(newUser:SignUpInput!):User
      signIn(newUser:SigninInput!):Token
      addPost(post: PostInput!):Post
    }
   
    type Category {
      _id:ID
      name: String
      image: String
    }

    type Product {
      _id:ID
      name: String
      discription: String
      price: Int
      specialPrice: Int
      isFixedPrice: Boolean
      stock: Int
      image: String
      attributes: [Attribute]
      categoryId: String
    }
    
    type Attribute {
      name: String
      options: [Option]
    }
    
    type Option {
      value: String
      price: Int
      description: String
    }
    type Student {
      _id:ID
      name:String
      age:Int
      gender:Gender
      dep_id:Department
    }
    enum Gender {
      Male
      Female
    }
    type Department {
      _id:ID
      name:String
    }     
    type Mark {
      _id:ID
      student_id:Student
      exam_id:Exam
      subject_id:Subject
      mark:Int
    }
    type MarkFilterResult {
      _id:ID
      subjects:[Subject]
      student:Student
      exams:[Exam]
      mark:Int
    }
    type Exam {
      _id:ID
      name:String
    } 
    type Subject {
      _id:ID
      name:String
    }
    type User {
      _id:ID!
      username:String!
      email:String!
      password:String!
    }
    type Post {
      _id:ID!
      title:String!
      content:String!
      author:User!
    }
    type Token {
      token:String
    }
    input SignUpInput{
      username:String!
      email:String!
      password:String!
    }
    input SigninInput{
      email:String!
      password:String!
    }
    input PostInput {
      title: String!
      content: String!
    }

    type Coupon {
      _id: ID!
      code: String!
      discount: Float!
      startDate: String!
      endDate: String!
      minOrder: Float
      isFixed: Boolean!
    }
  `;

export default typeDefs;
