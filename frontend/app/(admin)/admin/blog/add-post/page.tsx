import PostForm from "../components/PostForm";

const AddPostPage = () => {
    <div className="container mx-auto px-8">
        <div className="my-20 ">
            <div className="mx-auto w-[80%]">
                <h2 className="font-bold text-3xl mb-5 text-center">Создать Пост</h2>
                <div className="max-w-4xl mx-auto">
                   <PostForm />
                </div>
            </div>
        </div>
    </div>
}

export default AddPostPage;