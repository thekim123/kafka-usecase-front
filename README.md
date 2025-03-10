## Project Setup

### 1. 자바스크립트 버전바꾸기
아래 링크에서 fnm을 설치
[https://github.com/Schniz/fnm](https://github.com/Schniz/fnm)

- fnm으로 노드 22를 설치한다.
```shell
fnm install 22
```

- 아래 명령어로 버전 변경
```sh
fnm env --use-on-cd | Out-String | Invoke-Expression
```

- Powershell Profile PSSecurityException 에러
powershell을 관리자 권한으로 실행 후 다음 명령어로 ExecutionPolicy를 바꿔주면 된다
```shell
Set-ExecutionPolicy RemoteSigned
```

### 2. 의존성 설치
```sh
npm install
```

### 3. 개발용 웹 서버 실행
```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


### docker nginx 명령어
```shell
docker run -d --name mosaic-service-nginx -p 80:80 -v C:\mosaic-nginx-html:/usr/share/nginx/html:ro -v C:\Users\Joe\Desktop\di-deploy\dist/default.conf:/etc/nginx/conf.d/mosaic-service.conf:ro nginx
```

- `nginx` conf 파일
```nginx configuration
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
