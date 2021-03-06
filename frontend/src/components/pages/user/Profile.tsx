import { useContext, useEffect, useState, VFC, memo } from "react";
import {
  Box,
  Heading,
  Text,
  Center,
  Stack,
  Button,
  Divider,
} from "@chakra-ui/react";
import { useParams, Link, useHistory } from "react-router-dom";
import { getDetailUser } from "../../../api/user";
import { createFollow, deleteFollow } from "../../../api/follow";
import { AuthContext } from "../../../App";
import { Follow } from "../../../types/follow";
import { createRoom } from "../../../api/dm";

export const Profile: VFC = memo(() => {
  const { handleGetCurrentUser, currentUser } = useContext<any>(AuthContext);

  const history = useHistory();
  const [user, setUser] = useState({
    id: 0,
    name: "",
    email: "",
    followings: [],
    followers: [],
  });

  const query = useParams();

  const handleGetDetailUser = async (query: any) => {
    try {
      const res = await getDetailUser(query.id);
      console.log(res.data);
      setUser({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        followings: res.data.followings,
        followers: res.data.followers,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // フォロー機能API
  const handleCreateFollow = async (id: number) => {
    try {
      await createFollow(id);
      handleGetCurrentUser();
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteFollow = async (id: number) => {
    try {
      await deleteFollow(id);
      handleGetCurrentUser();
    } catch (e) {
      console.log(e);
    }
  };

  // ルーム機能API
  const handleCreateRoom = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    e.preventDefault();
    try {
      const res = await createRoom(id);
      console.log(res);
      history.push(`/room/${res.data.id}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleGetDetailUser(query);
  }, [query]);
  return (
    <Box width="100%" height="100%" p="40px">
      <Heading as="h1" textAlign="center" mb={4}>
        プロフィール
      </Heading>
      <Center
        width="240px"
        height="240px"
        bg="white"
        mx="auto"
        borderRadius="md"
        shadow="md"
        p="16px"
      >
        <Stack width="100%">
          <Text
            textAlign="center"
            color="teal"
            fontWeight="bold"
            fontSize="24px"
          >
            {user?.name}
          </Text>
          <Text textAlign="center">{user?.email}</Text>
          {user?.id === currentUser.id ? (
            <Text textAlign="center">現在のユーザーです</Text>
          ) : (
            <>
              {currentUser.followings?.find(
                (following: Follow) => user?.id === following.id
              ) ? (
                <Button
                  _hover={{ opacity: 0.8 }}
                  bg="teal"
                  color="white"
                  onClick={() => handleDeleteFollow(user?.id)}
                >
                  フォローを外す
                </Button>
              ) : (
                <Button
                  _hover={{ opacity: 0.8 }}
                  bg="teal"
                  color="white"
                  onClick={() => handleCreateFollow(user?.id)}
                >
                  フォローをする
                </Button>
              )}
              <Button
                _hover={{ opacity: 0.8 }}
                bg="teal"
                color="white"
                onClick={(e) => handleCreateRoom(e, user.id)}
              >
                DM
              </Button>
            </>
          )}
          <p>
            <Link to={`/following/${user.id}`}>
              フォロー数{user.followings?.length}
            </Link>
            <Link to={`/follower/${user.id}`}>
              フォロワー数{user.followers?.length}
            </Link>
          </p>
        </Stack>
      </Center>
      <Divider my="16px" />
    </Box>
  );
});
