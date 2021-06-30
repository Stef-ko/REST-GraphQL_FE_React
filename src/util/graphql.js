import { gql } from "@apollo/client";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
    }
  }
`;
export default FETCH_POSTS_QUERY;

// export const CREATE_POST_MUTATION = gql`
//   mutation createPost($body: String!) {
//     createPost(body: $body) {
//       id
//       body
//       createdAt
//       username
//     }
//   }
// `;
// export default CREATE_POST_MUTATION;
