import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import api from '../api/posts'
import useWindowSize from '../Hooks/useWindowSize';
import useAxiosFetch from '../Hooks/useAxiosFetch'
import { format } from 'date-fns';
const DataContext = createContext({});


export const DataProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [editTitle, setEditTitle] = useState('')
    const [editBody, setEditBody] = useState('')

    const navigate = useNavigate();
    // console.log("hello")
    const { width } = useWindowSize();
    const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');

    // useEffect(() => {
    //   const fetchPosts = async () => {
    //     try {
    //       const response = await api.get('/posts');  //already in json and already caught error if there is any.
    //       setPosts(response.data);
    //     } catch (err) {
    //       if (err.response) {
    //         //Not in the 200 response range response from backend
    //         console.log(err.response.data);
    //         console.log(err.response.status);
    //         console.log(err.resposne.headers);
    //       } else { //didn't got any response from backend as well.
    //         console.log(`Error:${err.message}`);
    //       }
    //     }
    //   }
    //   fetchPosts();
    // }, [])

    useEffect(() => {
        setPosts(data)
    }, [data]);

    useEffect(() => {
        const filtereResult = posts.filter(post =>
            ((post.body).toLowerCase()).includes(search.toLowerCase())
            || ((post.title).toLowerCase()).includes(search.toLowerCase()));
        setSearchResults(filtereResult.reverse());
    }, [posts, search])

    const handleDelete = async (id) => {
        try {
            await api.delete(`/posts/${id}`);
            const postsList = posts.filter(post => post.id !== id)
            setPosts(postsList);
            navigate('/');
        } catch (err) {
            console.log(`Error : ${err.message}`);
        }

    }
    const handleEdit = async (id) => {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const updatedPost = { id, title: editTitle, datetime, body: editBody }
        try {
            const response = await api.put(`/posts/${id}`, updatedPost)
            setPosts(posts.map((post) => post.id === id ? { ...response.data } : post));
            setEditTitle('');
            setEditBody('');
            navigate('/');
        } catch (err) {
            console.log(`Error : ${err.message}`);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const newPost = { id, title: postTitle, datetime, body: postBody }
        try {
            const response = await api.post('/posts', newPost);
            const allPosts = [...posts, response.data];
            setPosts(allPosts)
            setPostTitle('');
            setPostBody('');
            navigate('/')

        } catch (err) {
            console.log(`Error : ${err.message}`);
        }
    }
    return (
        <DataContext.Provider value={{
            width, search, setSearch, searchResults, setSearchResults, fetchError, isLoading,
            handleSubmit, postTitle, setPostTitle,
            postBody, setPostBody, handleEdit, editBody,
            setEditBody, editTitle, setEditTitle, posts, handleDelete
        }}>
            {children}
        </DataContext.Provider>
    )
}
export default DataContext;