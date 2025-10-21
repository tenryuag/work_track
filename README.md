# WorkTrack - 生産管理システム

WorkTrackは、日本の中小規模の工場向けに設計された生産注文管理システムです。迅速で使いやすく、視覚的に優れたインターフェースを提供します。

## 特徴

- **役割ベースのアクセス制御**: Admin、Manager、Operatorの3つの役割
- **注文管理**: 生産注文の作成、編集、削除、ステータス追跡
- **リアルタイムステータス更新**: 注文の進捗状況を即座に反映
- **レスポンシブデザイン**: デスクトップとタブレットに最適化
- **履歴追跡**: すべてのステータス変更を記録

## 技術スタック

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT認証
- Spring Data JPA
- H2 Database (開発環境)
- PostgreSQL対応 (本番環境)

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Vite

## プロジェクト構成

```
Work-track/
├── backend/                  # Spring Boot バックエンド
│   ├── src/
│   │   └── main/
│   │       ├── java/com/worktrack/backend/
│   │       │   ├── config/       # セキュリティ設定
│   │       │   ├── controller/   # REST API コントローラー
│   │       │   ├── dto/          # データ転送オブジェクト
│   │       │   ├── entity/       # データベースエンティティ
│   │       │   ├── repository/   # データアクセス層
│   │       │   ├── security/     # JWT & 認証
│   │       │   └── service/      # ビジネスロジック
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
└── frontend/                 # React フロントエンド
    ├── src/
    │   ├── components/       # 再利用可能コンポーネント
    │   ├── context/          # React Context (認証)
    │   ├── pages/            # ページコンポーネント
    │   ├── services/         # API サービス
    │   ├── types/            # TypeScript型定義
    │   ├── utils/            # ユーティリティ関数
    │   ├── App.tsx           # メインアプリケーション
    │   ├── main.tsx          # エントリーポイント
    │   └── index.css         # グローバルスタイル
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── tsconfig.json
```

## セットアップ手順

### 前提条件

- Java 17以上
- Maven 3.6以上
- Node.js 18以上
- npm または yarn

### Backend セットアップ

1. backendディレクトリに移動:
```bash
cd backend
```

2. 依存関係をインストールしてアプリケーションを実行:
```bash
mvn clean install
mvn spring-boot:run
```

3. バックエンドは `http://localhost:8080` で起動します

4. H2コンソール: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:worktrackdb`
   - Username: `sa`
   - Password: (空白)

### Frontend セットアップ

1. frontendディレクトリに移動:
```bash
cd frontend
```

2. 依存関係をインストール:
```bash
npm install
```

3. 開発サーバーを起動:
```bash
npm run dev
```

4. フロントエンドは `http://localhost:3000` で起動します

## テストアカウント

アプリケーション起動時に以下のテストユーザーが自動作成されます:

| 役割 | メールアドレス | パスワード | 権限 |
|------|---------------|-----------|------|
| Admin | admin@worktrack.com | admin123 | すべての操作が可能 |
| Manager | manager@worktrack.com | manager123 | 注文の閲覧とステータス変更 |
| Operator 1 | operator1@worktrack.com | operator123 | 自分の注文のみ閲覧・更新 |
| Operator 2 | operator2@worktrack.com | operator123 | 自分の注文のみ閲覧・更新 |

## 機能説明

### 役割と権限

#### Admin (管理者)
- 新規注文の作成
- 注文の編集・削除
- すべての注文の閲覧
- 注文のステータス変更
- すべてのモジュールへのアクセス

#### Manager (マネージャー)
- すべての注文の閲覧
- 注文のステータス変更

#### Operator (オペレーター)
- 自分に割り当てられた注文のみ閲覧
- 自分の注文のステータス更新

### 画面構成

#### 1. ログイン画面
- メールアドレスとパスワードで認証
- 認証成功後、HomePageにリダイレクト
- JWTトークンをlocalStorageに保存

#### 2. HomePage - 注文一覧
- すべての注文をカード形式で表示
- ステータスでフィルタリング (保留中・進行中・完了)
- 注文情報: 製品名、優先度、期限、担当者
- Admin権限: 「+ 新規注文」ボタン表示

#### 3. 新規注文作成
- 必須フィールド:
  - 製品名
  - 優先度 (高・中・低)
  - 担当者 (Operatorから選択)
  - 期限
- オプション: 説明
- 初期ステータス: 保留中

#### 4. 注文詳細画面
- すべての注文情報を表示
- ステータス変更ボタン
  - 新しいステータスを選択
  - コメント追加 (任意)
- ステータス履歴表示
  - 変更日時
  - 変更者
  - コメント

## API エンドポイント

### 認証
- `POST /api/auth/login` - ログイン

### 注文
- `GET /api/orders` - すべての注文取得
- `GET /api/orders/{id}` - 注文詳細取得
- `POST /api/orders` - 新規注文作成 (Admin)
- `PUT /api/orders/{id}` - 注文更新 (Admin)
- `DELETE /api/orders/{id}` - 注文削除 (Admin)
- `PATCH /api/orders/{id}/status` - ステータス更新
- `GET /api/orders/status/{status}` - ステータス別注文取得

### ユーザー
- `GET /api/users/operators` - オペレーター一覧
- `GET /api/users` - 全ユーザー一覧

## ビルド (本番環境)

### Backend
```bash
cd backend
mvn clean package
java -jar target/backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
```

ビルド結果は `frontend/dist` に生成されます。

## 環境変数設定

### Backend (application.properties)
本番環境用にPostgreSQLを使用する場合:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/worktrackdb
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

## トラブルシューティング

### ポートが既に使用されている
- Backend: `application.properties` で `server.port` を変更
- Frontend: `vite.config.ts` で `server.port` を変更

### CORS エラー
- `application.properties` の `cors.allowed-origins` を確認
- フロントエンドのURLが含まれていることを確認

### データベース接続エラー
- H2コンソールでデータベース状態を確認
- アプリケーション再起動でデータベースがリセットされます (H2使用時)

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。

## 作成者

WorkTrack Development Team
