import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SearchBar from "../components/SearchBar";
import ImageCard from "../components/cards/ImageCard";
import { GetPosts } from "../api";
import { CircularProgress } from "@mui/material";

const Container = styled.div`
  padding: 30px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 6px 10px;
  }
  background: ${({ theme }) => theme.background};
`;

const HeadLine = styled.div`
  font-size: 34px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Span = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.secondary};
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardWrapper = styled.div`
  display: grid;
  gap: 20px;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 640px) and (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 639px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filteredPost, setFilteredPost] = useState([]);

  const getPosts = async () => {
    setLoading(true);
    await GetPosts()
      .then((res) => {
        setPosts(res?.data?.data);
        setFilteredPost(res?.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error?.response?.data?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredPost(posts);
    }
    const filteredPosts = posts.filter((post) => {
      const promptMatch = post?.prompt?.toLowerCase().includes(search);
      const authorMatch = post?.author?.toLowerCase().includes(search);

      return promptMatch || authorMatch;
    });

    if (search) {
      setFilteredPost(filteredPosts);
    }
  }, [posts, search]);

  return (
    <Container>
      <HeadLine>
        Explore popular posts in the Community!
        <Span>⦾ Generated with AI ⦾</Span>
      </HeadLine>
      <SearchBar
        search={search}
        handleChange={(e) => setSearch(e.target.value)}
      />
      <Wrapper>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {loading ? (
          <CircularProgress />
        ) : (
          <CardWrapper>
            {filteredPost.length > 0 ? (
              <>
                {filteredPost
                  .slice()
                  .reverse()
                  .map((item, index) => (
                    <ImageCard key={index} item={item} />
                  ))}
              </>
            ) : (
              <>No Posts Found !!</>
            )}
          </CardWrapper>
        )}
      </Wrapper>
    </Container>
  );
};

export default Home;
