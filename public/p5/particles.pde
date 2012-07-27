// 初期値の設定
int ww = 1024; // 描画領域の幅
int wh = 768;  // 描画領域の高さ
int m  = 0;    // 四辺の計算上のマージン(外へ飛び出すパーティクルの処理用)
int ws = 200;  // パーティクル速度の初期値
int ms = 20; // masterのスピード初期値
int fontSize = 20;
int counter = 0;

// パーティクルオブジェクトの配列を作成
Particle[] particles = new Particle[floor(ww / fontSize) * floor(wh / fontSize)];

Master master = new Master(ww / 2, wh / 2);

String twittername = "shianbrown";
int[] twitternameArray = new int[twittername.length()];
int nameCounter = 0;

PFont font;
font = loadFont("fantasy");

// 初期化
void setup() {
  // p5の描画設定
  frameRate(60);
  size(ww, wh);
  noStroke();
  background(255);
  
  textFont(font, fontSize);
  
  // 全てのパーティクルの初期位置(x,y)をランダムに設定
  for (int i = 0; i < particles.length; i += 1) {
    int x = ww / 2 + round(i % (ww / fontSize)) * fontSize / 10;
    int y = wh / 2;
    particles[i] = new Particle(x, y);
    if (particles[i].charPos == nameCounter) {
      particles[i].s = 230;
      particles[i].ss = 230;
      particles[i].c = color(255, 255, 255, 255);
      nameCounter += 1;
      twitternameArray[nameCounter] = i;
    }
  }
}

// メインループ
void draw() {
  master.update();
  
  for (int i = 0; i < particles.length; i += 1) {
    particles[i].update();
  }
  fill(0, 50);
  rect(0, 0, ww, wh);
  
  counter += 1;
  if (200 < counter && counter < 260) {
    for (int i = 1; i < twitternameArray.length; i += 1) {
      particles[twitternameArray[i]].x += ((ww / 2 + i * fontSize) - particles[twitternameArray[i]].x) / 10;
      particles[twitternameArray[i]].y += (wh / 2 - particles[twitternameArray[i]].y) / 10;
    }
  }
  if (260 < counter) {
    counter = 0;
  }
}

// パーティクルオブジェクトのクラス定義
class Particle {
  // 自分の位置(x,y)、スピード初期値(s)、現在のスピード(ss)、進行方向ラジアン(d)
  float x, y, s, ss, d;
  // カラー型の変数、自分の色を保持
  color c;
  
  // コンストラクタ(Particle variablename = new Particle(x, y) で呼び出される)
  Particle (float xpos, float ypos) {
    this.x  = xpos;
    this.y  = ypos;
    this.s  = ws;
    this.ss = this.s;
    this.d  = random(TWO_PI);
    this.c  = color(int(random(200)) + 55, int(random(50)), int(random(50)), 255);
    this.charPos = round(random(twittername.length() - 1));
  }
  
  // 新しい自分の座標を計算してから実際に描画までを行うパブリックメソッド
  public void update() {
    v1 = new PVector(ww / 2, wh / 2);
    v2 = new PVector(this.x, this.y);
    float dt = PVector.angleBetween(v2, v1);
    this.d += (dt - this.d) / 1000;
  
    assignGravity();
    this.x += sin(this.d) * this.ss;
    this.y += cos(this.d) * this.ss;
    checkCollision();
    
    fill(this.c);
    text(twittername.charAt(this.charPos), this.x, this.y);
  }
  
  // 描画領域の外にはみ出ているかどうかをチェックするプライベートメソッド
  private void checkCollision() {
    if ( this.x <=m || this.x >= ww-m || this.y <= m || this.y >= wh-m) {
      // はみ出ていたら、進行方向方向を反転させる
      this.d -= PI;
    }
  }
  
  // マウスポインタの位置を中心に斥力を生じさせるプライベートメソッド
  private void assignGravity() {
    // マウス座標のベクトル(描画領域中央が原点になるように変換)
    v1 = new PVector(master.x-ww/2, master.y-wh/2);
    // 現在の位置のベクトル(描画領域中央を原点になるように変換)
    v2 = new PVector(this.x-ww/2, this.y-wh/2);
    // 二つのベクトル間の距離を計算
    float dt = PVector.dist(v1, v2);
    // 距離に応じて速度を変更
    this.ss = this.s*(1/dt);
  }
}

class Master {
  // 自分の位置(x,y)、スピード初期値(s)、現在のスピード(ss)、進行方向ラジアン(d)
  float x, y, s, ss, d;
  
  // コンストラクタ(Master variablename = new Master(x, y) で呼び出される)
  Master (float xpos, float ypos) {
    this.x  = xpos;
    this.y  = ypos;
    this.s  = ms;
    this.ss = this.s;
    this.d  = random(TWO_PI);
  }
  
  // 新しい自分の座標を計算するパブリックメソッド
  public void update() {
    this.x += sin(this.d) * this.ss;
    this.y += cos(this.d) * this.ss;
    this.d += random(TWO_PI) / 30 - TWO_PI / 60;
    checkCollision();
  }
  
  // 描画領域の外にはみ出ているかどうかをチェックするプライベートメソッド
  private void checkCollision() {
    if ( this.x <=m || this.x >= ww-m || this.y <= m || this.y >= wh-m) {
      // はみ出ていたら、進行方向方向を反転させる
      this.d -= PI;
    }
  }
}


