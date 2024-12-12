const gql = String.raw;

const typeDefs = gql`

type User {
    _id:ID!
    username:String
    email:String
    password: String
    bookCount: Int
    savedBooks: [Book]
    
}

type Book {
    _id:ID!
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

input SaveBookInput {
    bookId: String
    authors: [String]
    title: String
    description: String
    image: String
    link: String 
}

type Query {
    sayHello: String
    me: User
}


type Mutation {
    login(email: String!, password: String! ): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(saveBookInput : SaveBookInput! ): User
    removeBook(bookId: String!): User
}

`;

export default typeDefs;

