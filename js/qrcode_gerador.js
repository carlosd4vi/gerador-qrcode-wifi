    (function initWifiGenerator() {
      const ssidInput = document.getElementById('input-ssid');
      const passwordInput = document.getElementById('input-password');
      const passwordContainer = document.getElementById('password-field-container');
      const hiddenCheck = document.getElementById('check-hidden');
      const togglePassBtn = document.getElementById('toggle-password');
      const passIcon = document.getElementById('password-icon');
      const charCount = document.getElementById('char-count');
      const badgeSsid = document.getElementById('badge-ssid');
      const badgeSecurity = document.getElementById('badge-security');
      const badgeHiddenRow = document.getElementById('badge-hidden-row');
      const rawPayload = document.getElementById('raw-payload');
      const btnClear = document.getElementById('btn-clear');
      const btnGenerate = document.getElementById('btn-generate');
      const btnCopyPayload = document.getElementById('btn-copy-payload');
      const btnDownloadSvg = document.getElementById('btn-download-svg');
      const btnDownloadPng = document.getElementById('btn-download-png');
      const btnPrintSign = document.getElementById('btn-print-sign');
      const secButtons = document.querySelectorAll('.sec-option');
      
      let currentSecurity = 'WPA';

      function updatePayload() {
        const ssid = ssidInput.value.trim() || 'MinhaRede_5G';
        const pass = passwordInput.value;
        const isHidden = hiddenCheck.checked;
        
        let typeStr = currentSecurity;
        if (currentSecurity === 'nopass') typeStr = 'nopass';

        let str = `WIFI:S:${ssid};`;
        if (currentSecurity !== 'nopass') {
          str += `T:${typeStr};P:${pass};`;
        } else {
          str += `T:nopass;`;
        }
        if (isHidden) {
          str += `H:true;`;
        }
        str += `;`;

        rawPayload.textContent = str;
        badgeSsid.textContent = ssid;
        
        if (currentSecurity === 'nopass') {
          badgeSecurity.textContent = 'Sem Senha (Aberta)';
        } else if (currentSecurity === 'WEP') {
          badgeSecurity.textContent = 'WEP Legacy';
        } else {
          badgeSecurity.textContent = 'WPA/WPA2/WPA3';
        }

        if (isHidden) {
          badgeHiddenRow.classList.remove('hidden');
          badgeHiddenRow.classList.add('flex');
        } else {
          badgeHiddenRow.classList.remove('flex');
          badgeHiddenRow.classList.add('hidden');
        }

        charCount.textContent = `${pass.length} caracteres`;
      }

      secButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          secButtons.forEach(b => {
            b.className = 'sec-option py-2 px-3 rounded-lg text-center font-label-md text-label-md transition-all duration-150 text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1';
          });
          btn.className = 'sec-option py-2 px-3 rounded-lg text-center font-label-md text-label-md transition-all duration-150 bg-surface-container-lowest text-primary-container shadow-sm font-semibold flex items-center justify-center gap-1';
          
          currentSecurity = btn.getAttribute('data-sec');
          
          if (currentSecurity === 'nopass') {
            passwordContainer.style.opacity = '0.4';
            passwordInput.disabled = true;
          } else {
            passwordContainer.style.opacity = '1';
            passwordInput.disabled = false;
          }
          updatePayload();
        });
      });

      togglePassBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          passIcon.textContent = 'visibility_off';
          passwordInput.classList.add('font-code-sm');
        } else {
          passwordInput.type = 'password';
          passIcon.textContent = 'visibility';
          passwordInput.classList.remove('font-code-sm');
        }
      });

      ssidInput.addEventListener('input', updatePayload);
      passwordInput.addEventListener('input', updatePayload);
      hiddenCheck.addEventListener('change', updatePayload);

      btnClear.addEventListener('click', () => {
        ssidInput.value = '';
        passwordInput.value = '';
        hiddenCheck.checked = false;
        secButtons[0].click();
        ssidInput.focus();
        updatePayload();
      });

      function renderizarQRCodeAPI() {
        const payloadStr = rawPayload.textContent;
        const qrImage = document.getElementById('qr-image');
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payloadStr)}`;
        
        qrImage.style.opacity = '0.5';
        qrImage.src = apiUrl;
        
        qrImage.onload = () => {
          qrImage.style.opacity = '1';
        };
      }

      btnGenerate.addEventListener('click', () => {
        updatePayload();
        renderizarQRCodeAPI();
        
        const previewStatus = document.getElementById('preview-status');
        previewStatus.textContent = 'Gerado com sucesso!';
        
        if(window.innerWidth < 1024) {
           document.getElementById('qr-image').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
          previewStatus.textContent = 'Pronto para escanear';
        }, 2000);
      });

      btnCopyPayload.addEventListener('click', () => {
        navigator.clipboard.writeText(rawPayload.textContent).then(() => {
          const originalText = btnCopyPayload.innerHTML;
          btnCopyPayload.innerHTML = '<span class="material-symbols-outlined text-[14px]">check</span> Copiado!';
          setTimeout(() => {
            btnCopyPayload.innerHTML = originalText;
          }, 2000);
        });
      });

      async function forceDownloadFromUrl(url, fileName) {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        } catch (err) {
          window.open(url, '_blank');
        }
      }

      btnDownloadSvg.addEventListener('click', () => {
        const payloadStr = rawPayload.textContent;
        const svgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=svg&data=${encodeURIComponent(payloadStr)}`;
        forceDownloadFromUrl(svgUrl, `wifi-${ssidInput.value || 'rede'}-qrcode.svg`);
      });

      btnDownloadPng.addEventListener('click', () => {
        const payloadStr = rawPayload.textContent;
        const pngUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&format=png&data=${encodeURIComponent(payloadStr)}`;
        forceDownloadFromUrl(pngUrl, `wifi-${ssidInput.value || 'rede'}-qrcode.png`);
      });

      btnPrintSign.addEventListener('click', () => {
        document.getElementById('print-ssid').textContent = ssidInput.value || 'Wi-Fi Convidados';
        document.getElementById('print-password').textContent = currentSecurity === 'nopass' ? 'Sem senha' : (passwordInput.value || '---');
        
        const printPlaceholder = document.getElementById('print-qr-placeholder');
        printPlaceholder.innerHTML = '';
        
        const imgClone = document.getElementById('qr-image').cloneNode(true);
        imgClone.className = 'w-full h-full object-contain';
        printPlaceholder.appendChild(imgClone);
        
        window.print();
      });

      updatePayload();
      renderizarQRCodeAPI();
    })();
