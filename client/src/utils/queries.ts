import { gql } from "@apollo/client";
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      bookCount
      savedBooks {
        _id
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
