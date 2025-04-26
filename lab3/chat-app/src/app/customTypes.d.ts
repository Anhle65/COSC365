type User = {
    /**
     * User id as defined by the database
     */
    user_id: number,
    /**
     * Users username as entered when created
     */
    username: string
}

type Conversation = {
    convo_id: number,
    convo_name: string,
    created_on: string
}