/** authSlice.ts /loginuser/にアクセスした時にユーザー情報取得 */
export interface LOGIN_USER {
    id: number;
    username: string;
}

/** jsの標準の画像を扱える型を継承 */
export interface File extends Blob {
    // アップロード日
    readonly lastModified: number;
    // ファイル名
    readonly name: string;
}

/** /profile/にアクセスした時のプロフィール情報取得,ProfileSerializerと紐づく */
export interface PROFILE {
    id: number;
    user_profile: number;
    // プロフィール画像のURL, ない時もあるのでnull許容
    img: string | null;
}

/** Profile新規追加 */
export interface POST_PROFILE {
    id: number;
    img: File | null;
    // ↑のuser_profileプロパティはreadonlyなのでPOSTで新規追加する際は必要なし
}

/** credential 認証情報 */
export interface CRED {
    username: string;
    password: string;
}

/** JWTの認証トークン */
export interface JWT {
    refresh: string;
    access: string;
}

/** ユーザー一覧 */
export interface USER {
    id: number;
    username: string;
}

/** ログイン状態 */
export interface AUTH_STATE {
    // ログインフォームとユーザー新規追加フォームの切り替え
    isLoginView: boolean;
    loginUser: LOGIN_USER;
    // 存在するプロフィール一覧取得したものを格納
    profiles: PROFILE[];
}

/** taskSlice.ts /tasks/にアクセスした時にタスクデータ取得,TaskSerializerと一致する */
export interface READ_TASK {
    id: number;
    task: string;
    description: string;
    criteria: string;
    status: string;
    status_name: string;
    category: number;
    category_item: string;
    estimate: number;
    responsible: number;
    responsible_username: string;
    owner: number;
    owner_username: string;
    created_at: string;
    updated_at: string;
}
/**POSTでtaskを新規追加するときの型 */
export interface POST_TASK {
    id: number;
    task: string;
    description: string;
    criteria: string;
    status: string;
    category: number;
    estimate: number;
    responsible: number;
}
export interface CATEGORY {
    id: number;
    item: string;
}
// TASK画面全体の状態管理
export interface TASK_STATE {
    tasks: READ_TASK[]; // 一覧のタスク表示
    editedTask: POST_TASK; // 鉛筆マーク押した際のタスク編集画面のタスクの値
    selectedTask: READ_TASK; // タスク詳細画面のタスクの値
    users: USER[]; // ユーザー一覧, /users/にアクセスした時にユーザ一覧取得
    category: CATEGORY[]; // カテゴリー一覧, /category/にアクセスした時のカテゴリー一覧取得
}

/**TaskList.tsx */
/**並び替えの為の型 */
export interface SORT_STATE {
    rows: READ_TASK[];
    order: 'desc' | 'asc';
    activeKey: string;
}
