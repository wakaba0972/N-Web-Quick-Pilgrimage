# v1-5 <br>


* ## \<BUG\>圖片下載、顯示不全 :
   可能是請求過於頻繁被擋，或是太多request、fs流處理不完，因此用setInterval設置間隔時間，但仍有問題<br>
   
* ## \<BUG\>發現jpg/png格式混用之漫畫 :
   造成圖片顯示不全的原因之一，之後可能會從漫畫首頁的HTML中提取每頁的格式或URL


# v2-TEST<br>

* ## \<UPGRADE\>改為延遲載入(Lazy Loading) :
   圖片顯示不全可能Client是一次request所有圖片下載不完，因此改用Lazy Loading的方式，計畫以Intersection Observer API實作
  
* ## \<UPGRADE\>以base64編碼輸出圖片:
   v1為下載圖片至伺服主機，後以Client請求圖片位址的方式取得圖片<br>
   v2改為直接送出圖片base64編碼，藉此改善效率
