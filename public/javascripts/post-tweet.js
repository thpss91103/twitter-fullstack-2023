const postTweetArea = document.querySelectorAll('.post-tweet-area')
const postTweetModal = document.querySelector('#tweetModal')

postTweetArea.addEventListener('click', e => {
  const btn = e.target.classList.contains('post-tweet-area') ? e.target : e.target.parentElement

  const { userAvatar } = btn.dataset
  postTweetModal.innerHTML = `  <div class="modal-dialog">
  <div class="modal-content" style="width:634px;height:320px;border-radius:14px;padding:0px 16px">
   <div class=" d-flex justify-content-start m-2">
    <button
     type="button"
     class="btn-close "
     data-bs-dismiss="modal"
     aria-label="Close"
    ></button>
   </div>
<hr class="solid">
<form action="/tweets" method="POST">
  <div class="form-row d-flex flex-row mb-3" style="display:inline-block">
    <div class="user-avatar">
     <img src="${userAvatar}" width="50px" ;height="50px" style="display:inline-block;border-radius:100%;border:2px black solid;margin:auto 8px auto 24px" alt="avatar"> 
    </div>
       <textarea class="form-control" id="description" style="border:none;padding:0px;resize: none" name="description" rows="7" cols="20" maxlength:"140" minlength:"1"  placeholder="有什麼新鮮事?"></textarea>
 </div>

  <div class="d-flex justify-content-end">       
   <button type="submit" class="btn btn-primary m-1" style="color:#FFFFFF;width:64px;
 height:40px;border:none;background:#FF6600;border-radius:50px">推文</button>
  </div>
</form>
   </div>
 </div> `
})
