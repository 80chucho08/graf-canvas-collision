const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Configurar dimensiones del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = "#f3f3f4";

let contadorEliminados = 0;
const contadorEtiqueta = document.getElementById("contador");



class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color; // Guardar color original
        this.text = text;
        this.speed = speed;
        this.dx = 0; // No se moverán horizontalmente
        this.dy = speed; // Solo se moverán hacia abajo
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
        this.draw(context);

        // Actualizar posición solo en el eje Y (caída)
        this.posY += this.dy;

        // Reiniciar posición si llega al final del canvas
        if (this.posY - this.radius > canvas.height) {
            this.posY = -this.radius;
        }
    }
    
    isClicked(mouseX, mouseY) {
        let dx = mouseX - this.posX;
        let dy = mouseY - this.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.radius;
    }
}

let circles = [];

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * -canvas.height; // Aparecen desde arriba
        let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        let speed = Math.random() * 2 + 1;
        let text = `C${i + 1}`;
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
        circle.update(ctx, circles);
    });
    requestAnimationFrame(animate);
}

canvas.addEventListener("click", function(event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    
    let circulosAntes = circles.length;
    circles = circles.filter(circle => !circle.isClicked(mouseX, mouseY));
    let eliminadosEnEsteClick = circulosAntes - circles.length;

    // Actualizar el contador si se eliminó al menos un círculo
    if (eliminadosEnEsteClick > 0) {
        contadorEliminados += eliminadosEnEsteClick;
        contadorEtiqueta.textContent = `Círculos eliminados: ${contadorEliminados}`;
    }
});


generateCircles(10);
animate();
