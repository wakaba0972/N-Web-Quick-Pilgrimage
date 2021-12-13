初學勿噴
======

v1-5 <br>
----

* # 圖片下載、顯示不全 :
   可能是請求過於頻繁被擋，或是太多request、fs流處理不完，因此用setInterval設置間隔時間，但仍有問題<br>


v2-TEST<br>
------
* # 改為每頁由client發出request :
   Server request圖片二進制檔後，不儲存至本地，改為直接response至Client，整體邏輯須大幅修整，期望能改善圖片BUG<br>
   ### 流程構想 :
