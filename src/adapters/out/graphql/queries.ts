import { gql } from "@apollo/client";

export const GET_CONVERSATIONS = gql`
  query GetConversations($userId: String!) {
    conversations(userId: $userId) {
      id
      participantIds
      participantNames
      createdAt
      updatedAt
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: String!) {
    messages(conversationId: $conversationId) {
      id
      conversationId
      senderId
      content
      timestamp
    }
  }
`;

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($participantIds: [String!]!) {
    createConversation(participantIds: $participantIds) {
      id
      participantIds
      participantNames
      createdAt
    }
  }
`;
