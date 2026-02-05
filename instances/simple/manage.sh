
INSTANCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTANCE_NAME="$(basename "$INSTANCE_DIR")"

case "${1:-status}" in
    "start")
        echo "Starting instance $INSTANCE_NAME..."
        docker-compose -f "$INSTANCE_DIR/docker-compose.yml" up -d
        ;;
    "stop")
        echo "Stopping instance $INSTANCE_NAME..."
        docker-compose -f "$INSTANCE_DIR/docker-compose.yml" down
        ;;
    "restart")
        echo "Restarting instance $INSTANCE_NAME..."
        docker-compose -f "$INSTANCE_DIR/docker-compose.yml" restart
        ;;
    "logs")
        docker-compose -f "$INSTANCE_DIR/docker-compose.yml" logs -f
        ;;
    "status")
        docker-compose -f "$INSTANCE_DIR/docker-compose.yml" ps
        ;;
    "clean")
        echo "WARNING: This will remove all data for instance $INSTANCE_NAME"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose -f "$INSTANCE_DIR/docker-compose.yml" down -v --rmi all
            echo "Instance $INSTANCE_NAME cleaned"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|clean}"
        exit 1
        ;;
esac
