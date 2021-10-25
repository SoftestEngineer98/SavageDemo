let thumbUp = document.getElementsByClassName("fa-thumbs-up");
let thumbDown = document.getElementsByClassName("fa-thumbs-down")
let trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function (element) {
      element.addEventListener('click', function () {
        
        const name = this.parentNode.parentNode.childNodes[1].innerText;
        const msg = this.parentNode.parentNode.childNodes[3].innerText;
        const thumbUp = Number(this.parentNode.parentNode.childNodes[5].innerText);
        
        fetch('upVote', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'count':thumbUp,
            // 'plus': true
          }),
        })
        .then(response => {
          if (response.ok) return response.json();
        })
        .then(data => {
          console.log(data);
          window.location.reload(true);
        });
      });
});

Array.from(thumbDown).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText;
    const msg = this.parentNode.parentNode.childNodes[3].innerText;
    const thumbDown = Number(
      this.parentNode.parentNode.childNodes[5].innerText
    );
    
    fetch('downVote', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'count':thumbDown,
        // 'plus': false
      }),
    })
    .then(response => {
      if (response.ok) return response.json();
    })
    .then(data => {
      console.log(data);
      window.location.reload(true);
    });
  });
});

Array.from(trash).forEach(function (element) {
      element.addEventListener('click', function () {
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          }),
        }).then(function (response) {
          window.location.reload();
        });
      });
});