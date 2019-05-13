---
layout: post
title:  "simple idea for password"
date:   2018-08-28 10:58:07 +0100
categories: jekyll update
---
simple idea for password
I haven't learned technique to do so on a page. Like how to hide the javascript source code from users.
But considering the uninvertible property of sha1 or sha256 gives an idea.
```
Password = "A665A45920422F9D417E4867EFDC4FB8A04A1F3FFF1FA07E998E86F7F7A27AE3"
// which is the sha256 of "123"
public boolean password(String psw){
    if(sha256(pws) == Password){
        return true;
    }else{
        return false;
    }
}
```