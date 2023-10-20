import { useState, useEffect } from 'react'; 
import {useParams} from 'react-router-dom';
import articles from './article-content';
import axios from 'axios';
import NotFoundPage from './NotFoundPage';
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';
import useUser from '../hooks/useUser';


const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState ({ upvotes: 0 , comments: [], canUpvote: false});
    const {canUpvote} = articleInfo;
    const { articleId } = useParams();
    console.log("Artcle ID: " + articleId);

    const {user,isLoading} = useUser();

   useEffect(() => {
            const loadArticleInfo = async() =>
            {
                const token = user && await user.getIdToken();
                const headers = token ? {authtoken: token} : {};
                const response = await axios.get(`/api/articles/${articleId}`,{headers});
                const newArticleInfo = response.data;
                setArticleInfo(newArticleInfo);
            }

            if (!isLoading)
            {
                loadArticleInfo();
            }
            
            
        }, [isLoading,user]);
    
    
    const article = articles.find(article => article.name === articleId);
   
    const addUpvote = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? {authtoken: token} : {};
        const response = await axios.put(`/api/articles/${articleId}/upvote`,null, {headers});
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);

    };

    if(!article)
    {
        return <NotFoundPage />
    }
    return (
            <>
            <h1>{article.title}</h1>
            <div class="upvotes-section">
                {user ?
                <button onClick={addUpvote}>{canUpvote? 'Upvote' : 'Already upvoted'}</button>
                : <button>Login to upvote</button>
                }
                <p>This article has {articleInfo.upvotes} upvotes(s)</p>
            </div>
            {article.content.map((paragraph,i) => (
                <p key={i}>{paragraph}</p>
            ))}
            { user ?
            <AddCommentForm
                articleName={articleId}
                onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
                : <button>Login to comment</button>}
            <CommentsList comments={articleInfo.comments} />
            </>
    );

}

export default ArticlePage;