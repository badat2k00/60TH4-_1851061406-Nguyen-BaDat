const Imap = require('imap');
const { simpleParser } = require('mailparser');

async function receiveEmail(req, res) {
  const a = [];

  const imap = new Imap({
    user: 'vnfarmgl@gmail.com',
    password: 'ategomglxkjxltfx',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  });

  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  const connectAndFetchEmails = () =>
    new Promise((resolve, reject) => {
      imap.once('ready', () => {
        openInbox((err, box) => {
          if (err) return reject(err);

          const total = box.messages.total;
          const fetchRange = total > 10 ? `${total - 9}:${total}` : `1:${total}`;
          const fetch = imap.seq.fetch(fetchRange, {
            bodies: '',
            struct: true
          });

          fetch.on('message', (msg, seqno) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (!err) {
                  a.push({
                    subject: parsed.subject,
                    from: parsed.from.text,
                    text: parsed.text
                  });
                }
              });
            });
          });

          fetch.once('end', () => {
            imap.end();
          });
        });
      });

      imap.once('error', (err) => {
        reject(err);
      });

      imap.once('end', () => {
        resolve(a); // return collected emails
      });

      imap.connect();
    });

  try {
    const emails = await connectAndFetchEmails();
    res.json({ success: true, emails });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = receiveEmail;
