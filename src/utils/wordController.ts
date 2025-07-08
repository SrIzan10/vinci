// hangman word controller
// gnu gpl 3 by @SrIzan10
// coords for most stuff in canvas by claude 7 sonnet because i do not like canvas

import { createCanvas, type SKRSContext2D } from "@napi-rs/canvas";
import type { Context } from "@sern/handler";
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, type Message } from "discord.js";
import { EventEmitter } from "node:events";

export class WordController extends EventEmitter {
  private word: string;
  private canvasCtx = createCanvas(500, 500).getContext('2d');
  private ctx: Context;
  private msg?: Message;

  private incorrectLetters: string[] = [];
  private correctLetters: string[] = [];

  constructor(word: string, ctx: Context) {
    super();
    this.word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); // bye accents
    this.ctx = ctx;
  }

  public get data() {
    return {
      incorrect: this.incorrectLetters,
      correct: this.correctLetters,
      word: this.word,
    };
  }

  public async getMessage() {
    if (!this.msg) {
      await this.updateMsg();
    }
    return this.msg;
  }

  public async submitLetter(letter: string) {
    if (letter.length !== 1 || !/^[a-z]$/i.test(letter)) {
      letter = letter.toLowerCase().trim()[0];
    }
    if (this.incorrectLetters.includes(letter) || this.correctLetters.includes(letter)) {
      return;
    }

    if (!this.word.includes(letter)) {
      this.incorrectLetters.push(letter);
      this.emit('incorrect', letter);
    } else {
      this.correctLetters.push(letter);
      this.emit('correct', letter);
    }

    await this.updateMsg();
  }
  
  public async updateMsg() {
    this.canvasUpdate();
    const file = await this.canvasCtx.canvas.encode('webp');
    const attachment = new AttachmentBuilder(file, { name: 'hangman.webp' });

    if (!this.msg) {
      const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('hangman-answer').setLabel('Responde').setEmoji('✅').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('hangman-help').setLabel('Ayuda').setEmoji('❓').setStyle(ButtonStyle.Secondary),
      );
      this.msg = await this.ctx.reply({ files: [attachment], components: [buttons] });
      return this.msg;
    }

    return this.msg.edit({ files: [attachment] });
  }

  private canvasUpdate() {
    this.canvasCtx.fillStyle = '#1e1e2e';
    this.canvasCtx.fillRect(0, 0, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height);

    this.canvasCtx.strokeStyle = '#cdd6f4';
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(150, 320);
    this.canvasCtx.lineTo(150, 70);
    this.canvasCtx.lineTo(250, 70);
    this.canvasCtx.lineTo(250, 100);
    this.canvasCtx.stroke();

    if (this.incorrectLetters.length >= 1) this.writeHead();
    if (this.incorrectLetters.length >= 2) this.writeBody();
    if (this.incorrectLetters.length >= 3) this.writeLeg('left');
    if (this.incorrectLetters.length >= 4) this.writeLeg('right');
    if (this.incorrectLetters.length >= 5) this.writeArm('left');
    if (this.incorrectLetters.length >= 6) {
      this.writeArm('right');
      this.emit('gameOver', this.word);
    };

    const wordLength = this.word.length;
    const startX = 250 - (wordLength * 20);
    const baseY = 450;

    this.canvasCtx.font = '20px Arial';
    this.canvasCtx.textAlign = 'center';
    this.canvasCtx.fillStyle = '#cdd6f4';
    this.canvasCtx.strokeStyle = '#cdd6f4';
    this.canvasCtx.lineWidth = 2;

    for (let i = 0; i < wordLength; i++) {
      const letter = this.word[i];
      const letterX = startX + i * 40;

      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(letterX - 15, baseY + 5);
      this.canvasCtx.lineTo(letterX + 15, baseY + 5);
      this.canvasCtx.stroke();

      if (this.correctLetters.includes(letter.toLowerCase())) {
        this.canvasCtx.fillText(letter.toUpperCase(), letterX, baseY - 10);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      this.canvasCtx.font = '20px';
      this.canvasCtx.fillStyle = '#a6adc8';
      this.canvasCtx.fillText(`answer is: ${this.word}`, 250, 30);
    }
  }

  private writeHead() {
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(250, 115, 15, 0, 2 * Math.PI);
    this.canvasCtx.stroke();
  }

  private writeBody() {
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(250, 130);
    this.canvasCtx.lineTo(250, 200);
    this.canvasCtx.stroke();
  }

  private writeLeg(type: 'left' | 'right') {
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(250, 200);
    this.canvasCtx.lineTo(type === 'left' ? 225 : 275, 240);
    this.canvasCtx.stroke();
  }

  private writeArm(type: 'left' | 'right') {
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(250, 155);
    this.canvasCtx.lineTo(type === 'left' ? 225 : 275, 180);
    this.canvasCtx.stroke();
  }
}