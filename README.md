# v1-5 <br>


* ## \<BUG\>圖片下載、顯示不全 :
   可能是請求過於頻繁被擋，或是太多request、fs流處理不完，因此用setInterval設置間隔時間，但仍有問題<br>


# v2-TEST<br>

* ## \<UPGRADE\>改為每頁由client發出request :
   Server request圖片二進制檔後，不儲存至本地，改為直接response至Client，整體邏輯須大幅修整，期望能改善圖片BUG<br>
   * ### 流程構想 :
     Client送出urlNumber --> Server解析頁數與檔案格式回傳 --> Client送出欲加載的頁數 --> Server下載得二進制檔回傳 --> Client渲染網頁
