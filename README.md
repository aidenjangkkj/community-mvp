# Community MVP

간단한 커뮤니티 기능을 제공하는 React Native(Expo) 애플리케이션입니다.  
사용자는 회원가입/로그인 후 글을 작성하고, 다른 사용자가 남긴 글에 댓글을 달 수 있습니다.

## 주요 기능
- **회원가입 / 로그인**: Firebase Authentication을 사용해 이메일 기반 인증을 처리합니다.
- **글 목록 / 상세 조회**: Firestore에 저장된 글 데이터를 불러와 목록 및 상세 화면으로 표시합니다.
- **댓글 작성**: 각 글에 대해 댓글을 작성하고 실시간으로 확인할 수 있습니다.
- **이미지 업로드**: 게시글 작성 시 기기 갤러리의 이미지를 선택해 첨부할 수 있습니다.

## 사용 라이브러리
- **react-navigation**  
  여러 스크린 간 전환 및 기능 상호작용을 관리하는 데 사용합니다.
- **date-fns**  
  Firestore에 저장된 작성 일시를 `yyyy-MM-dd HH:mm` 형식으로 포맷팅합니다.
- **firebase**  
  회원가입/로그인(Authentication) 및 글과 댓글 데이터를 Firestore에 저장/조회하는 데 사용합니다.

## 프로젝트 구조
```
community-mvp/
├─ App.tsx                # 앱 진입점. NavigationContainer로 스택 네비게이션 설정
├─ components/            # PostItem, CommentItem 등 공용 컴포넌트
├─ docs/                  # 개발 문서(timestamps 등)
├─ src/
│  ├─ navigation/         # AppNavigator: 스택 라우트 정의
│  ├─ screens/            # Login, Register, PostList, PostDetail, CreatePost 스크린
│  └─ utils/              # formatTimestamp 등 유틸 함수
└─ types/                 # Post, Comment 타입 정의
```

## 시작하기
1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd community-mvp
   ```
2. **의존성 설치**
   ```bash
   npm install
   ```
3. **Firebase 환경설정**  
   `src/firebase/firebaseConfig.ts`(미포함)에 Firebase 프로젝트 설정을 추가합니다.
4. **앱 실행**
   ```bash
   npm run android    # 안드로이드
   npm run ios        # iOS
   npm start          # Expo DevTools
   ```

## 스크립트
| 명령어            | 설명                                         |
|------------------|----------------------------------------------|
| `npm start`      | Expo 개발 서버 실행                          |
| `npm run android`| Expo 개발 서버 + Android 에뮬레이터 실행     |
| `npm run ios`    | Expo 개발 서버 + iOS 시뮬레이터 실행         |
| `npm run web`    | 웹 환경에서 실행 (Expo Web)                  |
| `npm run lint`   | ESLint 및 Prettier 검사                      |
| `npm run format` | ESLint 자동 수정 + Prettier 포맷팅           |

---

필요한 다른 정보가 있다면 알려주세요!
