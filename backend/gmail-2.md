const Imap = require('imap');
const { simpleParser } = require('mailparser');

const imap = new Imap({
  user: 'vnfarmgl@gmail.com',
  password: 'ategomglxkjxltfx',
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
});

// ateg omgl xkjx ltfx
function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

imap.once('ready', function () {
  openInbox(function (err, box) {
    if (err) throw err;

    const fetch = imap.seq.fetch(`${box.messages.total}:*`, {
      bodies: '',
      struct: true,
    });

    fetch.on('message', function (msg, seqno) {
      msg.on('body', function (stream, info) {
        simpleParser(stream, (err, parsed) => {
          console.log('📨 Tiêu đề:', parsed.subject);
          console.log('👤 Từ:', parsed.from.text);
          console.log('📄 Nội dung:', parsed.text);
        });
      });
    });

    fetch.once('end', function () {
      console.log('✅ Kết thúc lấy email');
      imap.end();
    });
  });
});

imap.once('error', function (err) {
  console.log('Lỗi: ' + err);
});

imap.once('end', function () {
  console.log('Đã đóng kết nối IMAP');
});

imap.connect();
