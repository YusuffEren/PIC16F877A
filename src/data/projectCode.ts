export const projectCCode = `#include <xc.h>
#include <stdio.h>

// --- KONFIGURASYON ---
// HS: 20MHz yuksek hiz modu, WDTE: Kendi kendine reset atma kapali
#pragma config FOSC = HS, WDTE = OFF, PWRTE = ON, BOREN = ON, LVP = OFF, CPD = OFF, WRT = OFF, CP = OFF
#define _XTAL_FREQ 20000000 

// Pin Tanimlari
#define RS RC0
#define EN RC2
#define D4 RD4
#define D5 RD5
#define D6 RD6
#define D7 RD7
#define B_SAAT_ARTIR RB0
#define B_SAAT_AZALT RB1
#define B_DAK_ARTIR  RB2
#define B_DAK_AZALT  RB3

// Zaman degiskenleri 
volatile unsigned char sn = 0, dak = 0, saat = 12;
volatile unsigned char kesme_sayaci = 0; 
char lcd_buffer[20];

// --- LCD FONKSIYONLARI ---
void Lcd_Komut(unsigned char komut) {
    RS = 0; 
    PORTD = (PORTD & 0x0F) | (komut & 0xF0);
    EN = 1; __delay_us(40); EN = 0;
    PORTD = (PORTD & 0x0F) | ((komut << 4) & 0xF0);
    EN = 1; __delay_us(40); EN = 0;
    __delay_ms(2);
}

void Lcd_Yaz(unsigned char veri) {
    RS = 1; 
    PORTD = (PORTD & 0x0F) | (veri & 0xF0);
    EN = 1; __delay_us(40); EN = 0;
    PORTD = (PORTD & 0x0F) | ((veri << 4) & 0xF0);
    EN = 1; __delay_us(40); EN = 0;
    __delay_ms(2);
}

void Lcd_Hazirla() {
    __delay_ms(20);
    RS = 0; EN = 0;
    PORTD = 0x30;
    EN = 1; __delay_us(50); EN = 0;
    __delay_ms(5);
    EN = 1; __delay_us(50); EN = 0;
    __delay_us(200);
    EN = 1; __delay_us(50); EN = 0;
    PORTD = 0x20;
    EN = 1; __delay_us(50); EN = 0;
    Lcd_Komut(0x28);
    Lcd_Komut(0x0C);
    Lcd_Komut(0x06);
    Lcd_Komut(0x01);
    __delay_ms(2);
}

void Lcd_Git(unsigned char satir, unsigned char sutun) {
    if(satir == 1) Lcd_Komut(0x80 + (sutun - 1));
    else Lcd_Komut(0xC0 + (sutun - 1));
}

// --- ZAMANLAYICI KESMESI (INTERRUPT) ---
void __interrupt() kesme_servisi(void) {
    if (TMR1IF) { 
        TMR1H = 0x86; 
        TMR1L = 0x02; 
        kesme_sayaci++;
        if (kesme_sayaci >= 20) {
            kesme_sayaci = 0;
            sn++;
            if (sn >= 60) { 
                sn = 0; dak++; 
                if (dak >= 60) { dak = 0; saat++; if (saat >= 24) saat = 0; } 
            }
        }
        TMR1IF = 0;
    }
}

void main() {
    ADCON1 = 0x06;
    TRISB = 0x0F; TRISC = 0x00; TRISD = 0x00;
    Lcd_Hazirla();
    
    // --- TIMER1 KURULUMU ---
    T1CON = 0x31;
    TMR1H = 0x86;
    TMR1L = 0x02;
    TMR1IE = 1; PEIE = 1; GIE = 1;
    
    unsigned char b1_eski = 0, b2_eski = 0, b3_eski = 0, b4_eski = 0;

    while(1) {
        if (B_SAAT_ARTIR == 1 && b1_eski == 0) { saat = (saat + 1) % 24; __delay_ms(5); }
        b1_eski = B_SAAT_ARTIR;
        
        if (B_SAAT_AZALT == 1 && b2_eski == 0) { if(saat == 0) saat = 23; else saat--; __delay_ms(5); }
        b2_eski = B_SAAT_AZALT;
        
        if (B_DAK_ARTIR == 1 && b3_eski == 0) { 
            dak++; if(dak >= 60) { dak = 0; saat = (saat + 1) % 24; } __delay_ms(5); 
        }
        b3_eski = B_DAK_ARTIR;
        
        if (B_DAK_AZALT == 1 && b4_eski == 0) { 
            if(dak == 0) { dak = 59; if(saat == 0) saat = 23; else saat--; } else { dak--; } __delay_ms(5); 
        }
        b4_eski = B_DAK_AZALT;

        Lcd_Git(1, 1);
        char *title = "    DIJITAL SAAT ";
        while(*title) Lcd_Yaz(*title++);
        
        Lcd_Git(2, 5);
        sprintf(lcd_buffer, "%02d:%02d:%02d", saat, dak, sn);
        char *p = lcd_buffer;
        while(*p) Lcd_Yaz(*p++);
        
        __delay_ms(5);
    }
}`;
