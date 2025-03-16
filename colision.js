const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Configurar dimensiones del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "#f3f3f4";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color; // Guardar color original
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
        this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color; // Color del relleno
        context.strokeStyle = this.color; // Color del borde
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill(); // Rellenar el círculo
        context.stroke(); // Dibujar el borde
        context.closePath();
        
        // Dibujar el texto en el centro
        context.fillStyle = "#FFFFFF"; // Color del texto (negro)
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
    }

    update(context, circles) {
        this.checkCollision(circles); // Verificar colisiones antes de actualizar
        this.draw(context);

        // Actualizar posición
        this.posX += this.dx;
        this.posY += this.dy;

        // Rebote en los bordes
        if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    checkCollision(circles) {
        let isColliding = false; // Bandera para saber si hay colisión
        
        for (let other of circles) {
            if (this === other) continue; // No compararse con uno mismo
        
            let dx = this.posX - other.posX;
            let dy = this.posY - other.posY;
            let distance = Math.sqrt(dx * dx + dy * dy);
        
            if (distance < this.radius + other.radius) { // Si hay colisión
                isColliding = true;
                other.isColliding = true; // Marcar al otro círculo como colisionando
                
                this.color = "red";
                other.color = "red";
        
                // Intercambiar direcciones de movimiento
                let tempDx = this.dx;
                let tempDy = this.dy;
                this.dx = other.dx;
                this.dy = other.dy;
                other.dx = tempDx;
                other.dy = tempDy;
            }
        }
    
        // Volver al color original solo si no hay colisión
        if (!isColliding) {
            this.color = this.originalColor;
        }
    }
    
}

// Crear un array para almacenar los círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
        let text = `C${i + 1}`;
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
    circles.forEach(circle => {
        circle.update(ctx, circles);
    });
    requestAnimationFrame(animate);
}

// Generar círculos y comenzar la animación
generateCircles(10);
animate();
